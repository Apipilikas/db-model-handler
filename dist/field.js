"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const dataTypeValidator_1 = require("./utils/dataTypeValidator");
const errors_1 = require("./utils/errors");
class Field {
    /**
     * @constructor Field constructor
     * @param fieldName The field name
     * @param dataType The data type
     * @param readOnly The read only
     * @param primaryKey The primary key
     */
    constructor(fieldName, dataType, readOnly = false, primaryKey = false) {
        this._readOnly = false;
        this._nonStored = false;
        this._nullable = false;
        this._fieldName = fieldName;
        this._dataType = dataTypeValidator_1.DataTypeValidator.getDataType(dataType);
        this._readOnly = readOnly;
        this._primaryKey = primaryKey;
        this._defaultValue = dataTypeValidator_1.DataTypeValidator.resolve(dataType).defaultValue;
    }
    get fieldName() {
        return this._fieldName;
    }
    get dataType() {
        return this._dataType;
    }
    get primaryKey() {
        return this._primaryKey;
    }
    get readOnly() {
        return this._readOnly;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    set defaultValue(value) {
        this._defaultValue = value;
    }
    get nonStored() {
        return this._nonStored;
    }
    set nonStored(value) {
        this._nonStored = value;
    }
    get nullable() {
        return this._nullable;
    }
    set nullable(value) {
        this._nullable = value;
    }
    get model() {
        return this._model;
    }
    /**
     * Deserializes JSON format object into Field instance.
     * @param obj The JSON structure format object. If the input is string then it will be parsed into JSON.
     * @example
     * {
     *   "fieldName": "field1Name",
     *   "dataType": "string",
     *   "primaryKey": true,
     *   "readOnly": true,
     *   "nonStored": false
     * }
     */
    static deserializeStructure(obj) {
        if (dataTypeValidator_1.DataTypeValidator.isString(obj))
            obj = JSON.parse(obj);
        let fieldName = errors_1.FormatError.getValueOrThrow(obj, Field.NAME_KEY);
        let dataType = errors_1.FormatError.getValueOrThrow(obj, Field.DATATYPE_KEY);
        let primaryKey = errors_1.FormatError.getValueOrThrow(obj, Field.PRIMARYKEY_KEY);
        let readOnly = errors_1.FormatError.getValueOrThrow(obj, Field.READONLY_KEY);
        let nonStored = errors_1.FormatError.getValueOrThrow(obj, Field.NONSTORED_KEY);
        let field = new Field(fieldName, dataType, readOnly, primaryKey);
        field.nonStored = nonStored;
        return field;
    }
    /**
     * Sets model. Only for INTERNAL use.
     * @param model The model
     * @internal
     */
    setModel(model) {
        this._model = model;
    }
    /**
     * Serializes Field structure into JSON format.
     */
    serializeStructure() {
        let obj = {};
        obj[Field.NAME_KEY] = this._fieldName;
        obj[Field.DATATYPE_KEY] = this._dataType;
        obj[Field.PRIMARYKEY_KEY] = this._primaryKey;
        obj[Field.READONLY_KEY] = this._readOnly;
        obj[Field.NONSTORED_KEY] = this._nonStored;
        return obj;
    }
    /**
     * Gets serialized Field.
     */
    stringify() {
        return JSON.stringify(this.serializeStructure());
    }
}
exports.Field = Field;
Field.NAME_KEY = "fieldName";
Field.DATATYPE_KEY = "dataType";
Field.PRIMARYKEY_KEY = "primaryKey";
Field.READONLY_KEY = "readOnly";
Field.NONSTORED_KEY = "nonStored";
module.exports = { Field };
