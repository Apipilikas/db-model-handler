"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const fieldArray_1 = require("./arrays/fieldArray");
const recordArray_1 = require("./arrays/recordArray");
const relationArray_1 = require("./arrays/relationArray");
const field_1 = require("./field");
const filterSelector_1 = require("./filterEvaluator/filterSelector");
const record_1 = require("./record");
const dataTypeValidator_1 = require("./utils/dataTypeValidator");
const errors_1 = require("./utils/errors");
const events_1 = require("./events/events");
class Model {
    /**
     * @constructor Model constructor
     * @param modelName The model name
     */
    constructor(modelName) {
        this._isInitialized = false;
        this.strictMode = true;
        // Events
        this._valueChanging = new events_1.ValueChangingEvent();
        this._valueChanged = new events_1.ValueChangedEvent();
        this._recordDeleting = new events_1.RecordDeletingEvent();
        this._recordDeleted = new events_1.RecordDeletedEvent();
        this._modelName = modelName;
        this._fields = new fieldArray_1.FieldArray(this);
        this._records = new recordArray_1.RecordArray(this);
        this._parentRelations = new relationArray_1.RelationModelArray(this, true);
        this._childRelations = new relationArray_1.RelationModelArray(this, false);
        this.initModel();
        this.initPrimaryKey();
        this._isInitialized = true;
    }
    get modelName() {
        return this._modelName;
    }
    get fields() {
        return this._fields;
    }
    get records() {
        return this._records;
    }
    get schema() {
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
    get valueChanging() {
        return this._valueChanging;
    }
    get valueChanged() {
        return this._valueChanged;
    }
    get recordDeleting() {
        return this._recordDeleting;
    }
    get recordDeleted() {
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
    static deserializeStructure(obj) {
        if (dataTypeValidator_1.DataTypeValidator.isString(obj))
            obj = JSON.parse(obj);
        let modelName = errors_1.FormatError.getValueOrThrow(obj, Model.NAME_KEY);
        let fields = errors_1.FormatError.getValueOrThrow(obj, Model.FIELDS_KEY);
        let initFun = Model.prototype.initModel;
        Model.prototype.initModel = function () {
            fields.forEach(field => this._fields.push(field_1.Field.deserializeStructure(field)));
        };
        let model = new Model(modelName);
        Model.prototype.initModel = initFun;
        return model;
    }
    /**
     * Initializes the model. Fields should be initialized here.
     */
    initModel() {
        throw new errors_1.NotInitializedModelError(this.modelName);
    }
    initPrimaryKey() {
        this._primaryKey = this._fields.filter(field => field.primaryKey);
    }
    /**
     * Pushes new field into the FieldArray.
     * @param name The field name
     * @param dataType The data type
     * @param readOnly Declares whether field is readonly or not.
     * @param primaryKey Declares whether field is primary key or not.
     * @returns The pushed field
     */
    pushNewField(name, dataType, readOnly, primaryKey) {
        let field = new field_1.Field(name, dataType, readOnly, primaryKey);
        this._fields.push(field);
        return field;
    }
    /**
     * Pushes new record into the RecordArray.
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     */
    pushNewRecord(...values) {
        let record = record_1.Record.new(this, ...values);
        this._records.push(record);
        return record;
    }
    /**
     * Loads data into record.
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     */
    loadRecord(...values) {
        let record = record_1.Record.loadData(this, ...values);
        this._records.push(record);
        return record;
    }
    /**
     * Shows whether records have changes or not.
     */
    hasChanges() {
        for (var record of this._records) {
            if (record.hasChanges())
                return true;
        }
        return false;
    }
    /**
     * Commits changes to all records.
     */
    acceptChanges() {
        for (let i = this._records.length - 1; 0 <= i; i--) {
            this._records[i].acceptChanges();
        }
    }
    /**
     * Rolls back changes in every record.
     */
    rejectChanges() {
        for (let i = this._records.length - 1; 0 <= i; i--) {
            this._records[i].rejectChanges();
        }
    }
    getChangesBySave(forSave) {
        let array = [];
        for (let record of this._records) {
            if (record.state == 0 /* RecordState.UNMODIFIED */)
                continue;
            let obj = {};
            obj[record_1.Record.STATE_KEY] = record.state;
            obj[record_1.Record.VALUES_KEY] = (forSave) ? record.getChangesForSave() : record.getChanges();
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
    merge(model) {
        for (let field of this._fields) {
            try {
                model.fields.findByFieldName(field.fieldName);
            }
            catch (_a) {
                throw new errors_1.MergeModelError(model.modelName, this.modelName, field.fieldName);
            }
        }
        for (let record of model._records) {
            let existingRecord = this._records.findByPrimaryKey(...record.getPrimaryKeyValue());
            if (existingRecord != null) {
                existingRecord.merge(record);
            }
            else {
                let copiedRecord = record_1.Record.copy(this, record);
                this._records.push(copiedRecord);
            }
        }
    }
    /**
     * Serializes every record of the model into JSON format.
     */
    serialize() {
        let obj = {};
        let recordsArray = [];
        obj[Model.NAME_KEY] = this._modelName;
        this._records.forEach(record => recordsArray.push(record.serialize()));
        obj[Model.RECORDS_KEY] = recordsArray;
        return obj;
    }
    /**
     * Serializes only the important information of every record of the model into JSON format.
     */
    serializeForDisplay() {
        let recordsArray = [];
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
    deserialize(obj) {
        if (dataTypeValidator_1.DataTypeValidator.isString(obj))
            obj = JSON.parse(obj);
        let records = errors_1.FormatError.getValueOrThrow(obj, Model.RECORDS_KEY);
        for (let object of records) {
            let record = record_1.Record.deserialize(this, object);
            this._records.push(record);
        }
    }
    /**
     * Serializes Model structure into JSON format.
     */
    serializeStructure() {
        let obj = {};
        let fieldsArray = [];
        this._fields.forEach(field => fieldsArray.push(field.serializeStructure()));
        obj[Model.NAME_KEY] = this._modelName;
        obj[Model.FIELDS_KEY] = fieldsArray;
        return obj;
    }
    /**
     * Gets record based on the given filter.
     * @param filter The filter expression
     */
    select(filter) {
        return filterSelector_1.FilterSelector.getSelectedRecords(filter, this);
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
    setSchema(schema) {
        this._schema = schema;
    }
    /**
     *
     * @internal
     */
    onValueChanging(arg) {
        this._valueChanging.raiseEvent(this, arg);
    }
    /**
     *
     * @internal
     */
    onValueChanged(arg) {
        this._valueChanged.raiseEvent(this, arg);
    }
    /**
     *
     * @param arg
     * @internal
     */
    onRecordDeleting(arg) {
        this._recordDeleting.raiseEvent(this, arg);
    }
    /**
     *
     * @param arg
     * @internal
     */
    onRecordDeleted(arg) {
        this._recordDeleted.raiseEvent(this, arg);
    }
    containsFieldValue(fieldName, value) {
        for (let record of this._records) {
            if (record.getValue(fieldName) == value)
                return true;
        }
        return false;
    }
}
exports.Model = Model;
Model.NAME_KEY = "modelName";
Model.FIELDS_KEY = "fields";
Model.RECORDS_KEY = "records";
