"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const fieldArray_1 = require("./arrays/fieldArray");
const recordArray_1 = require("./arrays/recordArray");
const relationArray_1 = require("./arrays/relationArray");
const field_1 = require("./field");
const filterSelector_1 = require("./filterEvaluator/filterSelector");
const record_1 = require("./record");
const errors_1 = require("./utils/errors");
class Model {
    constructor(modelName) {
        this._isInitialized = true;
        this._modelName = modelName;
        this._fields = new fieldArray_1.FieldArray(this);
        this._records = new recordArray_1.RecordArray(this);
        this._parentRelations = new relationArray_1.RelationModelArray(this, true);
        this._childRelations = new relationArray_1.RelationModelArray(this, false);
        this.initModel();
        this._isInitialized = false;
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
    /**
     * @internal
     */
    get isInitialized() {
        return this._isInitialized;
    }
    static deserializeStructure(obj) {
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
    initModel() {
        throw new errors_1.NotInitializedModelError(this.modelName);
    }
    pushNewField(name, dataType, readOnly, primaryKey) {
        let field = new field_1.Field(name, dataType, readOnly, primaryKey);
        this._fields.push(field);
        return field;
    }
    pushNewRecord(...values) {
        let record = record_1.Record.new(this, ...values);
        this._records.push(record);
        return record;
    }
    loadRecord(...values) {
        let record = record_1.Record.loadData(this, ...values);
        this._records.push(record);
        return record;
    }
    loadRecords(data) {
        for (var obj of data) {
            this.loadRecord(...Object.values(obj));
        }
    }
    hasChanges() {
        for (var record of this._records) {
            if (record.hasChanges())
                return true;
        }
        return false;
    }
    acceptChanges() {
        this._records.forEach(record => record.acceptChanges());
    }
    rejectChanges() {
        this._records.forEach(record => record.rejectChanges());
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
    getChanges() {
        return this.getChangesBySave(false);
    }
    getChangesForSave() {
        return this.getChangesBySave(true);
    }
    merge(model) {
        for (let field of this._fields) {
            try {
                model.fields.findByFieldName(field.fieldName);
            }
            catch (_a) {
                throw new errors_1.MergeModelError(model.modelName, this.modelName, field.fieldName);
            }
        }
        for (let record of model.records) {
            let copiedRecord = record_1.Record.copy(this, record);
            this._records.push(copiedRecord);
        }
    }
    serialize() {
        let array = [];
        this._records.forEach(record => array.push(record.serialize()));
        return array;
    }
    deserialize(jsonString) {
        let parsedJson = JSON.parse(jsonString);
        for (let obj of parsedJson) {
            let record = record_1.Record.deserialize(this, obj);
            this._records.push(record);
        }
    }
    serializeStructure() {
        let obj = {};
        let fieldsArray = [];
        this._fields.forEach(field => fieldsArray.push(field.serializeStructure()));
        obj[Model.NAME_KEY] = this._modelName;
        obj[Model.FIELDS_KEY] = fieldsArray;
        return obj;
    }
    select(filter) {
        return filterSelector_1.FilterSelector.getSelectedRecords(filter, this);
    }
    getPrimaryKeys() {
        let array = [];
        this._fields.forEach(field => {
            if (field.primaryKey) {
                array.push(field.fieldName);
            }
        });
        return array;
    }
    /**
     *
     * @param schema
     * @internal
     */
    setSchema(schema) {
        this._schema = schema;
    }
}
exports.Model = Model;
Model.NAME_KEY = "name";
Model.FIELDS_KEY = "fields";
