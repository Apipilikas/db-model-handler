import { FieldArray } from "./arrays/fieldArray";
import { RecordArray } from "./arrays/recordArray";
import { RelationArray, RelationModelArray } from "./arrays/relationArray";
import { Field } from "./field";
import { FilterSelector } from "./filterEvaluator/filterSelector";
import { Record, RecordState } from "./record";
import { Schema } from "./schema";
import { DataType, DataTypeValidator } from "./utils/dataTypeValidator";
import { MergeModelError, NotInitializedModelError, FormatError } from "./utils/errors";
import { RecordDeletedEventArgs, RecordDeletingEventArgs, ValueChangeEventArgs } from "./events/eventArgs";
import { IMHEvent, ValueChangingEvent, ValueChangedEvent, RecordDeletingEvent, RecordDeletedEvent } from "./events/events";

export class Model {
    static NAME_KEY = "modelName";
    static FIELDS_KEY = "fields";
    static RECORDS_KEY = "records";

    private _modelName : string
    private _fields : FieldArray;
    private _records : RecordArray;
    private _schema : Schema;
    private _parentRelations : RelationModelArray;
    private _childRelations : RelationModelArray;
    private _primaryKey : Field[]
    private _isInitialized : boolean = false;
    public strictMode : boolean = true;

    // Events
    private _valueChanging : ValueChangingEvent = new ValueChangingEvent();
    private _valueChanged : ValueChangedEvent = new ValueChangedEvent();
    private _recordDeleting : RecordDeletingEvent = new RecordDeletingEvent();
    private _recordDeleted : RecordDeletedEvent = new RecordDeletedEvent();

    /**
     * @constructor Model constructor
     * @param modelName The model name
     */
    constructor(modelName : string) {
        this._modelName = modelName;
        this._fields = new FieldArray(this);
        this._records = new RecordArray(this);
        this._parentRelations = new RelationModelArray(this, true);
        this._childRelations = new RelationModelArray(this, false);

        this.initModel();
        this.initPrimaryKey();

        this._isInitialized = true;
    }

    get modelName() : string {
        return this._modelName;
    }

    get fields() : FieldArray {
        return this._fields;
    }

    get records(): RecordArray {
        return this._records;
    }

    get schema() : Schema {
        return this._schema;
    }

    get parentRelations() {
        return this._parentRelations;
    }

    get childRelations() {
        return this._childRelations;
    }

    get primaryKey() {
        return this._primaryKey;
    }

    /**
     * @internal
     */
    get isInitialized() {
        return this._isInitialized;
    }

    // Events
    get valueChanging() : IMHEvent {
        return this._valueChanging;
    }

    get valueChanged() : IMHEvent {
        return this._valueChanged;
    }

    get recordDeleting() : IMHEvent {
        return this._recordDeleting;
    }

    get recordDeleted() : IMHEvent {
        return this._recordDeleted;
    }

    /**
     * Deserializes JSON format object into Model instance.
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * @example
     * {
     *   "modelName": "modelName",
     *   "fields": [
     *     {
     *       "fieldName": "field1Name",
     *       "dataType": "string",
     *       "primaryKey": true,
     *       "readOnly": true,
     *       "nonStored": false
     *     }
     *   ]
     * }
     */
    static deserializeStructure(obj : any) {
        if (DataTypeValidator.isString(obj)) obj = JSON.parse(obj);

        let modelName = FormatError.getValueOrThrow<string>(obj, Model.NAME_KEY);
        let fields = FormatError.getValueOrThrow<any[]>(obj, Model.FIELDS_KEY);

        let initFun = Model.prototype.initModel;

        Model.prototype.initModel = function() {
            fields.forEach(field => this._fields.push(Field.deserializeStructure(field)));
        }

        let model = new Model(modelName);

        Model.prototype.initModel = initFun;

        return model;
    }

    /**
     * Initializes the model. Fields should be initialized here.
     */
    initModel() {
        throw new NotInitializedModelError(this.modelName);
    }

    private initPrimaryKey() {
        this._primaryKey = this._fields.filter(field => field.primaryKey)
    }

    /**
     * Pushes new field into the FieldArray.
     * @param name The field name
     * @param dataType The data type
     * @param readOnly Declares whether field is readonly or not.
     * @param primaryKey Declares whether field is primary key or not.
     * @returns The pushed field
     */
    pushNewField(name : string, dataType : string | any | DataType, readOnly : boolean, primaryKey : boolean) : Field {
        let field = new Field(name, dataType, readOnly, primaryKey);
        this._fields.push(field);
        return field;
    }

    /**
     * Pushes new record into the RecordArray.
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     */
    pushNewRecord(...values : any[]) : Record {
        let record = Record.new(this, ...values);
        this._records.push(record);
        return record;
    }

    /**
     * Loads data into record.
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     */
    loadRecord(...values : any[]) : Record {
        let record = Record.loadData(this, ...values);
        this._records.push(record);
        return record;
    }

    /**
     * Shows whether records have changes or not.
     */
    hasChanges() : boolean {
        for (var record of this._records) {
            if (record.hasChanges()) return true;
        }

        return false;
    }

    /**
     * Commits changes to all records.
     */
    acceptChanges() : void {
        for (let i = this._records.length - 1; 0 <= i; i--) {
            this._records[i].acceptChanges();
        }
    }

    /**
     * Rolls back changes in every record.
     */
    rejectChanges() : void {
        for (let i = this._records.length - 1; 0 <= i; i--) {
            this._records[i].rejectChanges();
        }
    }

    private getChangesBySave(forSave : boolean) {
        let array : any[] = [];
        for (let record of this._records) {
            if (record.state == RecordState.UNMODIFIED) continue;
            
            let obj: {[k: string]: any} = {};
            obj[Record.STATE_KEY] = record.state;
            obj[Record.VALUES_KEY] = (forSave) ? record.getChangesForSave() : record.getChanges();
            
            array.push(obj);
        }

        return array;
    }

    /**
     * Gets changes of each record into JSON format.
     */
    getChanges() {
        return this.getChangesBySave(false);
    }

    /**
     * Gets changes of each record excluding non stored fields into JSON format.
     */
    getChangesForSave() {
        return this.getChangesBySave(true);
    }

    /**
     * Merges model into this one.
     * @param model The model to be merged
     */
    merge(model : Model) {
        for (let field of this._fields) {
            try {
                model.fields.findByFieldName(field.fieldName)
            }
            catch {
                throw new MergeModelError(model.modelName, this.modelName, field.fieldName);
            }
        }
        
        for (let record of model._records) {
            let existingRecord = this._records.findByPrimaryKey(...record.getPrimaryKeyValue());
            if (existingRecord != null) {
                existingRecord.merge(record);
            }
            else {
                let copiedRecord = Record.copy(this, record);
                this._records.push(copiedRecord);
            }
        }
    }

    /**
     * Serializes every record of the model into JSON format.
     */
    serialize() {
        let obj : {[k: string]: any} = {};
        let recordsArray : any[] = [];
        
        obj[Model.NAME_KEY] = this._modelName;
        this._records.forEach(record => recordsArray.push(record.serialize()));
        obj[Model.RECORDS_KEY] = recordsArray;

        return obj;
    }

    /**
     * Serializes only the important information of every record of the model into JSON format.
     */
    serializeForDisplay() {
        let recordsArray : any[] = [];
        this._records.forEach(record => recordsArray.push(record.serializeForDisplay()));
        return recordsArray;
    }

    /**
     * Deserializes the JSON object into model records.
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * @example
     * {
     *   "records": [
     *     {
     *       "state": 0,
     *       "original": {
     *         "field1Name": "value1",
     *         "field2Name": 2
     *       },
     *       "current": {
     *         "field1Name": "value1_modified",
     *         "field2Name": 3
     *       }
     *     }
     *   ]
     * }
     */
    deserialize(obj : any) {
        if (DataTypeValidator.isString(obj)) obj = JSON.parse(obj);

        let records = FormatError.getValueOrThrow<any[]>(obj, Model.RECORDS_KEY);

        for (let object of records) {
            let record = Record.deserialize(this, object);
            this._records.push(record);
        }
    }

    /**
     * Serializes Model structure into JSON format.
     */
    serializeStructure() {
        let obj: {[k: string]: any} = {};
        let fieldsArray : any[] = [];

        this._fields.forEach(field => fieldsArray.push(field.serializeStructure()));

        obj[Model.NAME_KEY] = this._modelName;
        obj[Model.FIELDS_KEY] = fieldsArray;

        return obj;
    }

    /**
     * Gets record based on the given filter.
     * @param filter The filter expression
     */
    select(filter : string) : Record[] {
        return FilterSelector.getSelectedRecords(filter, this);
    }

    /**
     * Gets primary key field names.
     */
    getPrimaryKeyName() {
        return this._primaryKey.map(pk => pk.fieldName);
    }

    /**
     * Sets schema. Only for INTERNAL use.
     * @param schema The schema
     * @internal
     */
    setSchema(schema : Schema) {
        this._schema = schema;
    }

    /**
     * 
     * @internal
     */
    onValueChanging(arg : ValueChangeEventArgs) {
        this._valueChanging.raiseEvent(this, arg);
    }

    /**
     * 
     * @internal
     */
    onValueChanged(arg : ValueChangeEventArgs) {
        this._valueChanged.raiseEvent(this, arg);
    }

    /**
     * 
     * @param arg 
     * @internal
     */
    onRecordDeleting(arg : RecordDeletingEventArgs) {
        this._recordDeleting.raiseEvent(this, arg);
    }

    /**
     * 
     * @param arg 
     * @internal
     */
    onRecordDeleted(arg : RecordDeletedEventArgs) {
        this._recordDeleted.raiseEvent(this, arg);
    }

    containsFieldValue(fieldName : string, value : any) {
        for (let record of this._records) {
            if (record.getValue(fieldName) == value) return true;
        }

        return false;
    }
}