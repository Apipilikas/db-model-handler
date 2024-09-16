"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const dataTypeValidator_1 = require("./utils/dataTypeValidator");
const errors_1 = require("./utils/errors");
class Field {
    constructor(fieldName, dataType, readOnly = false, primaryKey = false) {
        this._readOnly = false;
        this._nonStored = false;
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
    get nonStored() {
        return this._nonStored;
    }
    set nonStored(value) {
        this._nonStored = value;
    }
    get model() {
        return this._model;
    }
    static deserializeStructure(obj) {
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
     *
     * @param model
     * @internal
     */
    setModel(model) {
        this._model = model;
    }
    serializeStructure() {
        let obj = {};
        obj[Field.NAME_KEY] = this._fieldName;
        obj[Field.DATATYPE_KEY] = this._dataType;
        obj[Field.PRIMARYKEY_KEY] = this._primaryKey;
        obj[Field.READONLY_KEY] = this._readOnly;
        obj[Field.NONSTORED_KEY] = this._nonStored;
        return obj;
    }
    stringify() {
        return JSON.stringify(this.serializeStructure());
    }
}
exports.Field = Field;
Field.NAME_KEY = "name";
Field.DATATYPE_KEY = "dataType";
Field.PRIMARYKEY_KEY = "primaryKey";
Field.READONLY_KEY = "readOnly";
Field.NONSTORED_KEY = "nonStored";
module.exports = { Field };
