"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Record = void 0;
const _1 = require(".");
const fieldValueArray_1 = require("./arrays/fieldValueArray");
const fieldValue_1 = require("./fieldValue");
const errors_1 = require("./utils/errors");
class Record {
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
    static new(model, ...values) {
        let record = new Record(model);
        record.initFieldValues();
        record.loadData(...values);
        record._origin = 0 /* RecordOrigin.NEW */;
        return record;
    }
    static loadData(model, ...values) {
        let record = new Record(model);
        record.loadFirstData(...values);
        record._origin = 1 /* RecordOrigin.LOADED */;
        return record;
    }
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
    getValue(fieldName, version = fieldValue_1.FieldValueVersion.CURRENT) {
        if (this._state == 3 /* RecordState.DELETED */ && version == fieldValue_1.FieldValueVersion.CURRENT)
            throw new Error("Cannot get CURRENT value on DELETED record.");
        let fieldValue = this._fieldValues.findByFieldName(fieldName);
        return fieldValue.getValue(version);
    }
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
            let fieldValue = fieldValue_1.FieldValue.loadData(this._model.fields[i], values[i]);
            this._fieldValues.push(fieldValue);
        }
        this.initFieldValues(values.length);
    }
    loadData(...values) {
        for (var i = 0; i < values.length; i++) {
            let value = values[i];
            if (value == undefined)
                continue;
            this._fieldValues[i].value = values[i];
        }
    }
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
    getChanges() {
        return this.getChangesByNonStoredFields(true);
    }
    getChangesForSave() {
        return this.getChangesByNonStoredFields(false);
    }
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
    addProperty(key, value) {
        this._properties.set(key, value);
    }
    containsProperty(key) {
        return this._properties.has(key);
    }
    removeProperty(key) {
        return this._properties.delete(key);
    }
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
    serialize() {
        let obj = {};
        obj[Record.STATE_KEY] = this._state;
        obj[Record.ORIGINAL_VALUES_KEY] = this.serializeByVersion(true, fieldValue_1.FieldValueVersion.ORIGINAL);
        obj[Record.CURRENT_VALUES_KEY] = this.serializeByVersion(true, fieldValue_1.FieldValueVersion.CURRENT);
        return obj;
    }
    /**
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
