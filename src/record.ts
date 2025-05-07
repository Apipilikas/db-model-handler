import internal from "stream";
import { DataTypeValidator } from ".";
import { FieldValueArray } from "./arrays/fieldValueArray";
import { FieldValue, FieldValueVersion } from "./fieldValue"
import { Model } from "./model";
import { ForeignFieldReferenceError, FormatError } from "./utils/errors";
import { Relation } from "./relation";
import { RecordUtils } from "./utils/recordUtils";
import { RecordDeletedEventArgs, RecordDeletingEventArgs, ValueChangeEventArgs } from "./events/eventArgs";
import { ChangesTracker } from "./utils/changesTracker";

export const enum RecordState {
    UNMODIFIED = 0,
    ADDED = 1,
    MODIFIED = 2,
    DELETED = 3,
    DETACHED = 4
}

const enum RecordOrigin {
    NEW = 0,
    LOADED = 1,
    COPIED = 2
}

export class Record {
    static STATE_KEY = "state";
    static ORIGINAL_VALUES_KEY = "original";
    static CURRENT_VALUES_KEY = "current";
    static VALUES_KEY = "values";
    static CHILD_VALUES_KEY = "childValues";
    static PARENT_VALUE_KEY = "parentValue"
    static CHILD_MODEL_NAME_KEY = "childModelName"
    static CHILD_FIELD_NAME_KEY = "childFieldName"
    static CHILD_MODEL_PRIMARY_KEY_VALUES_KEY = "childModelPrimaryKeyValues"

    private _model : Model;
    private _state = RecordState.DETACHED;
    private _fieldValues : FieldValueArray;
    private _properties = new Map();
    private _origin : RecordOrigin;
    private _changesTracker : ChangesTracker;

    /**
     * @constructor Record contructor
     * @param model The model
     */
    protected constructor(model : Model) {
        this._model = model;
        this._fieldValues = new FieldValueArray();
        this._changesTracker = new ChangesTracker(this);
    }

    get model() {
        return this._model;
    }

    get state() {
        return this._state;
    }

    get properties() {
        return this._properties;
    }

    /**
     * Creates a new Record instance.
     * @param model The model
     * @param values Param array of values. Values order should correspond to the fields order. 
     * Undefined can be used to skip value.
     * @returns 
     */
    static new(model : Model, ...values : any[]) {
        let record = new Record(model);
        record.initFieldValues();
        record.loadData(...values);
        record._origin = RecordOrigin.NEW;
        return record;
    }

    /**
     * Creates a Record instance and loads values into record.
     * @param model The model
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     * @returns 
     */
    static loadData(model : Model, ...values : any[]) {
        let record = new Record(model);
        record.loadFirstData(...values);
        record._origin = RecordOrigin.LOADED;
        return record;
    }

    /**
     * Copies a Record into a new one preserving its behavior.
     * @param model The model
     * @param record The record to be copied
     * @returns The copied Record
     */
    static copy(model : Model, record : Record) {
        let copiedRecord = new Record(model);
        copiedRecord._state = record.state;
        copiedRecord._origin = RecordOrigin.COPIED;
        copiedRecord._properties = new Map(record._properties);

        for (let field of model.fields) {
            let fieldValue = record._fieldValues.findByFieldName(field.fieldName);

            let copiedFieldValue = FieldValue.copy(field, fieldValue);
            copiedRecord._fieldValues.push(copiedFieldValue);
        }

        return copiedRecord;
    }

    /**
     * Deserializes the JSON object into Record.
     * @param model The model
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * @example
     * {
     *   "state": 0,
     *   "original": {
     *     "field1Name": "value1",
     *     "field2Name": 2
     *   },
     *   "current": {
     *     "field1Name": "value1_modified",
     *     "field2Name": 3
     *   }
     * }
     */
    static deserialize(model : Model, obj : any) : Record {
        let recordState = FormatError.getValueOrThrow<RecordState>(obj, Record.STATE_KEY);
        let currentProperty = FormatError.getValueOrThrow<any>(obj, Record.CURRENT_VALUES_KEY);
        
        let currentValues = Record.getCorrectValuesOrderList(model, currentProperty);
        let record : Record;

        switch (recordState as RecordState) {
            case RecordState.ADDED:
                record = Record.new(model, ...currentValues);
                break;
            case RecordState.UNMODIFIED:
                record = Record.loadData(model, ...currentValues);
                break;
            case RecordState.MODIFIED:
                let originalProperty = FormatError.getValueOrThrow<any>(obj, Record.CURRENT_VALUES_KEY);
                let originalValues = Record.getCorrectValuesOrderList(model, originalProperty);
                
                record = Record.loadData(model, ...originalValues);
                record.loadData(...currentProperty);
                break;
            case RecordState.DELETED:
                record = Record.loadData(model);
                record.delete();
                break;
            default:
                record = Record.new(model);
                break;
        }

        return record;
    }

    /**
     * Gets values list in correct order based on model fields.
     * @param model The model
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * The object should have fields that belongs to model fields.
     * @returns List of values in correct order that corresponds to fields order. For the fields that were not
     * included in JSON object, default value is taken instead.
     */
    static getCorrectValuesOrderList(model : Model, obj : any) : any[] {
        if (DataTypeValidator.DataTypeValidator.isString(obj)) obj = JSON.parse(obj);

        let values : any[] = [];
        let objPropertiesCount = 0;
        let objPropertiesLength = Object.keys(obj).length - 1;

        for (var field of model.fields) {
            let value = obj[field.fieldName];

            if (value != null) {
                values.push(value);

                if (objPropertiesCount == objPropertiesLength) break;
            }
            else {
                values.push(field.defaultValue);
            }
        }
        
        return values;
    }

    /**
     * Gets field's value.
     * @param fieldName The field name
     * @param version The field value version
     */
    getValue(fieldName : string, version : FieldValueVersion = FieldValueVersion.CURRENT) : any {
        if (this._state == RecordState.DELETED && version == FieldValueVersion.CURRENT) 
            throw new Error("Cannot get CURRENT value on DELETED record.");

        let fieldValue = this._fieldValues.findByFieldName(fieldName);
        return fieldValue.getValue(version);
    }

    /**
     * Sets field's value.
     * @param fieldName The field name
     * @param value The proposed value
     */
    setValue(fieldName : string, value : any) {
        if (this._state == RecordState.DELETED) throw new Error("Cannot set value on DELETED record.");

        let fieldValue = this._fieldValues.findByFieldName(fieldName);
        let previousValue = fieldValue.value;
        this.setFieldValue(fieldValue, value);
        this.updateCascadeChildRecords(fieldName, previousValue, value);
    }

    private setFieldValue(fieldValue : FieldValue, value : any) {
        let previousValue = fieldValue.value;
        let eventArgs = new ValueChangeEventArgs(fieldValue.field, this, previousValue, value);
        this._model.onValueChanging(eventArgs);

        fieldValue.value = eventArgs.proposedValue;
        if (this._changesTracker.isOnChangeMode()) this._changesTracker.pushChange(fieldValue, value);

        if (!fieldValue.hasChanged()) return;
        this._model.onValueChanged(new ValueChangeEventArgs(fieldValue.field, this, previousValue, fieldValue.value));

        if (this._state != RecordState.DETACHED && this._state != RecordState.ADDED) this._state = RecordState.MODIFIED;
    }

    private initFieldValues(startIndex = 0) {
        for (var i = startIndex; i < this._model.fields.length; i++) {
            let field = this._model.fields[i];
            let fieldValue = FieldValue.new(field);
            this._fieldValues.push(fieldValue);
        }
    }

    private loadFirstData(...values : any[]) : void {
        for (var i = 0; i < values.length; i++) {
            let field = this._model.fields[i];
            let value : any = values[i];

            if (value == undefined) value = field.defaultValue;

            let fieldValue = FieldValue.loadData(this._model.fields[i], value);
            this._fieldValues.push(fieldValue);
        }

        this.initFieldValues(values.length);
    }

    /**
     * Sets multiple values.
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     */
    loadData(...values : any[]) {
        for (var i = 0; i < values.length; i++) {
            let value = values[i];
            
            if (value == undefined) continue;

            this.setFieldValue(this._fieldValues[i], value);
        }
    }

    /**
     * Deletes record.
     * @throws Error in DELETED and DETACHED state
     */
    delete() : void {
        switch (this._state) {
            case RecordState.UNMODIFIED:
            case RecordState.MODIFIED:
                if (!this.shouldDeleteRecord()) return;

                this.deleteCascadeChildRecords();
                this._state = RecordState.DELETED;

                this._model.onRecordDeleted(new RecordDeletedEventArgs(this));
                break;

            case RecordState.ADDED:
                if (!this.shouldDeleteRecord()) return;

                this.deleteCascadeChildRecords();
                this.remove();

                this._model.onRecordDeleted(new RecordDeletedEventArgs(this));
                break;

            case RecordState.DELETED:
                throw new Error("Record is already DELETED.");
            case RecordState.DETACHED:
                throw new Error("Record is DETACHED. Cannot be deleted.");
        }
    }

    private shouldDeleteRecord() {
        let event = new RecordDeletingEventArgs(this);
        this._model.onRecordDeleting(event);
        return !event.cancel;
    }

    private deleteCascadeChildRecords() {
        for (let relation of this._model.childRelations) {
            let childRecords = this.getChildRecordsByRelation(relation);

            if (relation.cascadeDelete) {
                childRecords.forEach(record => record.delete());
            }
            else {
                if (childRecords.length > 0) throw new ForeignFieldReferenceError(relation);
            }
        }
    }

    private updateCascadeChildRecords(fieldName : string, previousValue : any, proposedValue : any) {
        let relations = this._model.childRelations.filterByParentFieldName(fieldName);
        
        for (let relation of relations) {
            let childFieldName = relation.childField.fieldName;
            let records = this.getChildRecordsByValue(relation, previousValue); // Before update
            records.forEach(record => record.setValue(childFieldName, proposedValue)); // Update
        }
    }

    private remove() : void {
        this._state = RecordState.DETACHED;
        this._model.records.remove(this);
    }

    /**
     * Shows whether record has changes or not.
     */
    hasChanges() : boolean {
        return this._state != RecordState.UNMODIFIED;
    }

    private hasStrictChanges() : boolean {
        for (var fieldValue of this._fieldValues) {
            if (fieldValue.hasChanged()) return true;
        }

        return false;
    }

    /**
     * Commits all changes.
     */
    acceptChanges() : void {
        switch (this._state) {
            case RecordState.DELETED:
                this.remove();
                break;
            case RecordState.DETACHED:
                throw new Error("Record is DETACHED. Cannot accept changes.");
            case RecordState.ADDED:
            case RecordState.MODIFIED:
                this._fieldValues.forEach(fieldValue => fieldValue.acceptChange());
                this._state = RecordState.UNMODIFIED;
                break;
        }
    }

    /**
     * Rolls back all changes.
     */
    rejectChanges() : void {
        switch (this._state) {
            case RecordState.ADDED:
                this.remove();
                break;
            case RecordState.MODIFIED:
            case RecordState.DELETED:
                this._fieldValues.forEach(fieldValue => fieldValue.rejectChange());
                this._state = RecordState.UNMODIFIED;
                break;
            case RecordState.DETACHED:
                throw new Error("Record is DETACHED. Cannot reject changes.");
        }
    }

    beginChanges() {
        this._changesTracker.beginChanges();
    }

    endChanges() {
        this._changesTracker.endChanges();
    }

    cancelChanges() {
        this._changesTracker.cancelChanges();
    }

    private getChangesByNonStoredFields(includeNonStored : boolean) {
        let obj : {[k: string]: any} = {};

        switch(this._state) {
            case RecordState.ADDED:
                obj = this.serializeByVersion(includeNonStored);
                break;
            case RecordState.DELETED:
            case RecordState.MODIFIED:
                obj = this.serializeChanges(includeNonStored);
                break;
        }

        return obj;
    }

    /**
     * Gets all changes into JSON format.
     */
    getChanges() {
        return this.getChangesByNonStoredFields(true);
    }

    /**
     * Gets all changes excluding non stored fields into JSON format.
     */
    getChangesForSave() {
        return this.getChangesByNonStoredFields(false);
    }

    /**
     * Gets parent record based on given relation name and field value version.
     * @param relationName The relation name of relation
     * @param version The field value version
     */
    getParentRecord(relationName : string, version : FieldValueVersion = FieldValueVersion.CURRENT) : Record | null {
        let relation = this._model.parentRelations.findByRelationName(relationName);

        if (relation == null) return null;

        let parentFieldName = relation.parentField.fieldName;
        let childFieldName = relation.childField.fieldName;

        for (var record of relation.parentModel.records) {
            if (record.getValue(parentFieldName, version) == this.getValue(childFieldName, version)) {
                return record;
            }
        }

        return null;
    }

    /**
     * Gets child records based on given relation name.
     * @param relationName The relation name of relation
     */
    getChildRecords(relationName : string) : Record[] | null

    /**
     * Gets child records based on given relation name and field value version.
     * @param relationName The relation name of relation
     * @param version The field value version
     */
    getChildRecords(relationName : string, version : FieldValueVersion = FieldValueVersion.CURRENT) : Record[] | null {
        let relation = this._model.childRelations.findByRelationName(relationName);
        if (relation == null) return null;

        return this.getChildRecordsByRelation(relation, version);
    }

    /**
     * Gets child records based on given relation and field value version.
     * @param relation The relation
     */
    getChildRecordsByRelation(relation : Relation, version : FieldValueVersion = FieldValueVersion.CURRENT) {
        let parentFieldName = relation.parentField.fieldName;
        return this.getChildRecordsByValue(relation, this.getValue(parentFieldName, version), version);
    }

    private getChildRecordsByValue(relation : Relation, value : any, version : FieldValueVersion = FieldValueVersion.CURRENT) {
        let childFieldName = relation.childField.fieldName;

        let results: Record[] = [];

        for (var record of relation.childModel.records) {
            if (record.getValue(childFieldName, version) == value) {
                results.push(record);
            }
        }

        return results;
    }

    /**
     * Gets primary key values.
     */
    getPrimaryKeyValue() {
        let values : any[] = [];

        for (let primaryKey of this._model.getPrimaryKeyName()) {
            switch(this._state) {
                case RecordState.UNMODIFIED:
                case RecordState.MODIFIED:
                case RecordState.DELETED:
                    values.push(this.getValue(primaryKey, FieldValueVersion.ORIGINAL));
                    break;
                case RecordState.DETACHED:
                case RecordState.ADDED:
                    values.push(this.getValue(primaryKey));
                    break;
            }
        }

        return values;
    }

    /**
     * Adds property to record.
     * @param key The key
     * @param value The value
     */
    addProperty(key : string, value : any) : void {
        this._properties.set(key, value);
    }

    /**
     * Contains property.
     * @param key The key
     */
    containsProperty(key : string) : boolean {
        return this._properties.has(key);
    }

    /**
     * Remove property from record.
     * @param key The key
     */
    removeProperty(key : string) : boolean {
        return this._properties.delete(key);
    }

    /**
     * Gets property from given key.
     * @param key The key
     */
    getProperty(key : string) : any {
        return this._properties.get(key);
    }
    
    private serializeByVersion(includeNonStored : boolean, version = FieldValueVersion.CURRENT) {
        let obj: {[k: string]: any} = {};

        if (this._state == RecordState.DELETED && version == FieldValueVersion.CURRENT) return obj;

        for (var fieldValue of this._fieldValues) {
            if (!includeNonStored && fieldValue.field.nonStored) continue;
            obj[fieldValue.fieldName] = fieldValue.getValue(version);
        }

        return obj;
    }

    private serializeChanges(includeNonStored : boolean) {
        let obj: {[k: string]: any} = {};

        switch(this._state) {
            case RecordState.DELETED:
                for (var primaryKeyFieldName of this._model.getPrimaryKeyName()) {
                    obj[primaryKeyFieldName] = this.getValue(primaryKeyFieldName, FieldValueVersion.ORIGINAL);
                }
                return obj;
            case RecordState.UNMODIFIED:
                return obj;
        }

        for (var fieldValue of this._fieldValues) {
            if (!fieldValue.field.primaryKey && !fieldValue.hasChanged()) continue;
            if (!includeNonStored && fieldValue.field.nonStored) continue;

            obj[fieldValue.fieldName] = fieldValue.getValue(FieldValueVersion.CURRENT);
        }

        return obj;
    }

    /**
     * Serializes record values into JSON format.
     */
    serialize() {
        let obj: {[k: string]: any} = {};

        obj[Record.STATE_KEY] = this._state;
        obj[Record.ORIGINAL_VALUES_KEY] = this.serializeByVersion(true, FieldValueVersion.ORIGINAL);
        obj[Record.CURRENT_VALUES_KEY] = this.serializeByVersion(true, FieldValueVersion.CURRENT);

        return obj;
    }

    /**
     * Serializes current record values into JSON format. If record is DELETED, original values are returned instead.
     */
    serializeForDisplay() {
        if (this._state == RecordState.DELETED) return this.serializeByVersion(true, FieldValueVersion.ORIGINAL);
        return this.serializeByVersion(true, FieldValueVersion.CURRENT);
    }

    /**
     * Merges record into this one.
     * @param record The record to be merged
     */
    merge(record : Record) {
        if (!RecordUtils.hasSamePrimaryKey(this, record)) return;

        // Record to be merged
        switch (record._state) {
            case RecordState.UNMODIFIED:
            case RecordState.MODIFIED:
                // Source Record
                switch (this._state) {
                    case RecordState.UNMODIFIED:
                    case RecordState.MODIFIED:
                        this.mergeChanges(record);
                        break;
                }
                break;
            case RecordState.DELETED:
                if (this._state != RecordState.DELETED) this.delete();
                break;
            case RecordState.ADDED:
                if (this._state != RecordState.ADDED) break;
                this.mergeChanges(record);
                break;
            case RecordState.DETACHED:
        }
    }

    /**
     * Merges json object into this one.
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * The object should have fields that belongs to model fields.
     */
    mergeBySerialization(obj : any) {
        try {
            this.beginChanges();

            if (DataTypeValidator.DataTypeValidator.isString(obj)) obj = JSON.parse(obj);
    
            for (let objEntry of Object.entries(obj)) {
                this.setValue(objEntry[0], objEntry[1]);
            }

            this.endChanges();
        }
        catch(e) {
            this.cancelChanges();
            throw e;
        }
    }

    private mergeChanges(record : Record) {
        try {
            this.beginChanges();

            let values = record.serializeByVersion(true);
            let orderedValues = Record.getCorrectValuesOrderList(this._model, values);
            this.loadData(...orderedValues);

            this.endChanges();
        }
        catch(e) {
            this.cancelChanges();
            throw e;
        }
    }

    /**
     * Only for INTERNAL use. Sets status when record is pushed to RecordArray.
     * @internal
     */
    setStateOnPush() {
        switch (this._origin) {
            case RecordOrigin.NEW:
                this._state = RecordState.ADDED;
                break;
            case RecordOrigin.LOADED:
                if (this.hasStrictChanges()) this._state = RecordState.MODIFIED;
                else this._state = RecordState.UNMODIFIED;
                break;
            case RecordOrigin.COPIED:
                break;
            default:
                throw new Error("ORIGIN ENUM ERROR");
        }        
    }
}

module.exports = {Record};