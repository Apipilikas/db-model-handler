"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Record = void 0;
const _1 = require(".");
const fieldValueArray_1 = require("./arrays/fieldValueArray");
const fieldValue_1 = require("./fieldValue");
const errors_1 = require("./utils/errors");
class Record {
    /**
     * @constructor Record contructor
     * @param model The model
     */
    constructor(model) {
        this._state = 4 /* RecordState.DETACHED */;
        this._properties = new Map();
        this._model = model;
        this._fieldValues = new fieldValueArray_1.FieldValueArray();
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
    static new(model, ...values) {
        let record = new Record(model);
        record.initFieldValues();
        record.loadData(...values);
        record._origin = 0 /* RecordOrigin.NEW */;
        return record;
    }
    /**
     * Creates a Record instance and loads values into record.
     * @param model The model
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     * @returns
     */
    static loadData(model, ...values) {
        let record = new Record(model);
        record.loadFirstData(...values);
        record._origin = 1 /* RecordOrigin.LOADED */;
        return record;
    }
    /**
     * Copies a Record into a new one preserving its behavior.
     * @param model The model
     * @param record The record to be copied
     * @returns The copied Record
     */
    static copy(model, record) {
        let copiedRecord = new Record(model);
        copiedRecord._state = record.state;
        copiedRecord._origin = 2 /* RecordOrigin.COPIED */;
        copiedRecord._properties = new Map(record._properties);
        for (let field of model.fields) {
            let fieldValue = record._fieldValues.findByFieldName(field.fieldName);
            let copiedFieldValue = fieldValue_1.FieldValue.copy(field, fieldValue);
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
    static deserialize(model, obj) {
        let recordState = errors_1.FormatError.getValueOrThrow(obj, Record.STATE_KEY);
        let originalProperty = errors_1.FormatError.getValueOrThrow(obj, Record.ORIGINAL_VALUES_KEY);
        let originalValues = Record.getCorrectValuesOrderList(model, originalProperty);
        let record;
        switch (recordState) {
            case 1 /* RecordState.ADDED */:
                record = Record.new(model, ...originalValues);
                break;
            case 0 /* RecordState.UNMODIFIED */:
                record = Record.loadData(model, ...originalValues);
                break;
            case 2 /* RecordState.MODIFIED */:
                record = Record.loadData(model, ...originalValues);
                let currentProperty = errors_1.FormatError.getValueOrThrow(obj, Record.CURRENT_VALUES_KEY);
                let currentValues = Record.getCorrectValuesOrderList(model, currentProperty);
                record.loadData(...currentValues);
                break;
            case 3 /* RecordState.DELETED */:
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
     * Gets values list in correct order based on fields.
     * @param model The model
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * The object should have fields that belongs to model fields.
     * @returns List of values in correct order that corresponds to fields order. For the fields that were not
     * included in JSON object, default value is taken instead.
     */
    static getCorrectValuesOrderList(model, obj) {
        if (_1.DataTypeValidator.DataTypeValidator.isString(obj))
            obj = JSON.parse(obj);
        let values = [];
        let objPropertiesCount = 0;
        let objPropertiesLength = Object.keys(obj).length - 1;
        for (var field of model.fields) {
            let value = obj[field.fieldName];
            if (value != null) {
                values.push(value);
                if (objPropertiesCount == objPropertiesLength)
                    break;
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
    getValue(fieldName, version = fieldValue_1.FieldValueVersion.CURRENT) {
        if (this._state == 3 /* RecordState.DELETED */ && version == fieldValue_1.FieldValueVersion.CURRENT)
            throw new Error("Cannot get CURRENT value on DELETED record.");
        let fieldValue = this._fieldValues.findByFieldName(fieldName);
        return fieldValue.getValue(version);
    }
    /**
     * Sets field's value.
     * @param fieldName The field name
     * @param value The proposed value
     */
    setValue(fieldName, value) {
        if (this._state == 3 /* RecordState.DELETED */)
            throw new Error("Cannot set value on DELETED record.");
        let fieldValue = this._fieldValues.findByFieldName(fieldName);
        fieldValue.value = value;
        if (this._state != 4 /* RecordState.DETACHED */ && fieldValue.hasChanged() && this._state != 1 /* RecordState.ADDED */)
            this._state = 2 /* RecordState.MODIFIED */;
    }
    initFieldValues(startIndex = 0) {
        for (var i = startIndex; i < this._model.fields.length; i++) {
            let field = this._model.fields[i];
            let fieldValue = fieldValue_1.FieldValue.new(field);
            this._fieldValues.push(fieldValue);
        }
    }
    loadFirstData(...values) {
        for (var i = 0; i < values.length; i++) {
            let field = this._model.fields[i];
            let value = values[i];
            if (value == undefined)
                value = field.defaultValue;
            let fieldValue = fieldValue_1.FieldValue.loadData(this._model.fields[i], value);
            this._fieldValues.push(fieldValue);
        }
        this.initFieldValues(values.length);
    }
    /**
     * Sets multiple values.
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     */
    loadData(...values) {
        for (var i = 0; i < values.length; i++) {
            let value = values[i];
            if (value == undefined)
                continue;
            this._fieldValues[i].value = value;
        }
    }
    /**
     * Deletes record.
     * @throws Error in DELETED and DETACHED state
     */
    delete() {
        switch (this._state) {
            case 0 /* RecordState.UNMODIFIED */:
            case 2 /* RecordState.MODIFIED */:
                this._state = 3 /* RecordState.DELETED */;
                break;
            case 1 /* RecordState.ADDED */:
                this.remove();
                break;
            case 3 /* RecordState.DELETED */:
                throw new Error("Record is already DELETED.");
            case 4 /* RecordState.DETACHED */:
                throw new Error("Record is DETACHED. Cannot be deleted.");
        }
    }
    remove() {
        this._state = 4 /* RecordState.DETACHED */;
        this._model.records.remove(this);
    }
    /**
     * Shows whether record has changes or not.
     */
    hasChanges() {
        return this._state != 0 /* RecordState.UNMODIFIED */;
    }
    hasStrictChanges() {
        for (var fieldValue of this._fieldValues) {
            if (fieldValue.hasChanged())
                return true;
        }
        return false;
    }
    /**
     * Commits all changes.
     */
    acceptChanges() {
        switch (this._state) {
            case 3 /* RecordState.DELETED */:
                this.remove();
                break;
            case 4 /* RecordState.DETACHED */:
                throw new Error("Record is DETACHED. Cannot accept changes.");
            case 1 /* RecordState.ADDED */:
            case 2 /* RecordState.MODIFIED */:
                this._fieldValues.forEach(fieldValue => fieldValue.acceptChange());
                this._state = 0 /* RecordState.UNMODIFIED */;
                break;
        }
    }
    /**
     * Rolls back all changes.
     */
    rejectChanges() {
        switch (this._state) {
            case 1 /* RecordState.ADDED */:
                this.remove();
                break;
            case 2 /* RecordState.MODIFIED */:
            case 3 /* RecordState.DELETED */:
                this._fieldValues.forEach(fieldValue => fieldValue.rejectChange());
                this._state = 0 /* RecordState.UNMODIFIED */;
                break;
            case 4 /* RecordState.DETACHED */:
                throw new Error("Record is DETACHED. Cannot reject changes.");
        }
    }
    getChangesByNonStoredFields(includeNonStored) {
        let obj = {};
        switch (this._state) {
            case 1 /* RecordState.ADDED */:
                obj = this.serializeByVersion(includeNonStored);
                break;
            case 3 /* RecordState.DELETED */:
            case 2 /* RecordState.MODIFIED */:
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
     * Gets parent record based on given relation name.
     * @param relationName The relation name of relation
     */
    getParentRecord(relationName) {
        let relation = this._model.parentRelations.findByRelationName(relationName);
        if (relation == null)
            return null;
        let parentFieldName = relation.parentField.fieldName;
        let childFieldName = relation.childField.fieldName;
        for (var record of relation.parentModel.records) {
            if (record.getValue(parentFieldName) == this.getValue(childFieldName)) {
                return record;
            }
        }
        return null;
    }
    /**
     * Gets child records based on given relation name.
     * @param relationName The relation name of relation
     */
    getChildRecords(relationName) {
        let relation = this._model.childRelations.findByRelationName(relationName);
        if (relation == null)
            return null;
        let parentFieldName = relation.parentField.fieldName;
        let childFieldName = relation.childField.fieldName;
        let results = [];
        for (var record of relation.childModel.records) {
            if (record.getValue(childFieldName) == this.getValue(parentFieldName)) {
                results.push(record);
            }
        }
        return results;
    }
    /**
     * Adds property to record.
     * @param key The key
     * @param value The value
     */
    addProperty(key, value) {
        this._properties.set(key, value);
    }
    /**
     * Contains property.
     * @param key The key
     */
    containsProperty(key) {
        return this._properties.has(key);
    }
    /**
     * Remove property from record.
     * @param key The key
     */
    removeProperty(key) {
        return this._properties.delete(key);
    }
    /**
     * Gets property from given key.
     * @param key The key
     */
    getProperty(key) {
        return this._properties.get(key);
    }
    serializeByVersion(includeNonStored, version = fieldValue_1.FieldValueVersion.CURRENT) {
        let obj = {};
        if (this._state == 3 /* RecordState.DELETED */ && version == fieldValue_1.FieldValueVersion.CURRENT)
            return obj;
        for (var fieldValue of this._fieldValues) {
            if (!includeNonStored && fieldValue.field.nonStored)
                continue;
            obj[fieldValue.fieldName] = fieldValue.getValue(version);
        }
        return obj;
    }
    serializeChanges(includeNonStored) {
        let obj = {};
        switch (this._state) {
            case 3 /* RecordState.DELETED */:
                for (var primaryKeyFieldName of this._model.getPrimaryKeys()) {
                    obj[primaryKeyFieldName] = this.getValue(primaryKeyFieldName, fieldValue_1.FieldValueVersion.ORIGINAL);
                }
                return obj;
            case 0 /* RecordState.UNMODIFIED */:
                return obj;
        }
        for (var fieldValue of this._fieldValues) {
            if (!fieldValue.field.primaryKey && !fieldValue.hasChanged())
                continue;
            if (!includeNonStored && fieldValue.field.nonStored)
                continue;
            obj[fieldValue.fieldName] = fieldValue.getValue(fieldValue_1.FieldValueVersion.CURRENT);
        }
        return obj;
    }
    /**
     * Serializes record values into JSON format.
     */
    serialize() {
        let obj = {};
        obj[Record.STATE_KEY] = this._state;
        obj[Record.ORIGINAL_VALUES_KEY] = this.serializeByVersion(true, fieldValue_1.FieldValueVersion.ORIGINAL);
        obj[Record.CURRENT_VALUES_KEY] = this.serializeByVersion(true, fieldValue_1.FieldValueVersion.CURRENT);
        return obj;
    }
    /**
     * Only for INTERNAL use. Sets status when record is pushed to RecordArray.
     * @internal
     */
    setStateOnPush() {
        switch (this._origin) {
            case 0 /* RecordOrigin.NEW */:
                this._state = 1 /* RecordState.ADDED */;
                break;
            case 1 /* RecordOrigin.LOADED */:
                if (this.hasStrictChanges())
                    this._state = 2 /* RecordState.MODIFIED */;
                else
                    this._state = 0 /* RecordState.UNMODIFIED */;
                break;
            case 2 /* RecordOrigin.COPIED */:
                break;
            default:
                throw new Error("ORIGIN ENUM ERROR");
        }
    }
}
exports.Record = Record;
Record.STATE_KEY = "state";
Record.ORIGINAL_VALUES_KEY = "original";
Record.CURRENT_VALUES_KEY = "current";
Record.VALUES_KEY = "values";
module.exports = { Record };
