import { Model } from "./model";
import { DataType, DataTypeValidator } from "./utils/dataTypeValidator"
import { FormatError } from "./utils/errors";

export class Field {
    static NAME_KEY = "name";
    static DATATYPE_KEY = "dataType";
    static PRIMARYKEY_KEY = "primaryKey";
    static READONLY_KEY = "readOnly";
    static NONSTORED_KEY = "nonStored";

    private _fieldName : string;
    private _dataType : DataType;
    private _primaryKey : boolean;
    private _readOnly = false;
    private _nonStored = false;
    private _defaultValue : any;
    private _model : Model;

    constructor(fieldName : string, dataType : string | object | DataType, readOnly = false, primaryKey = false) {
        this._fieldName = fieldName;
        this._dataType = DataTypeValidator.getDataType(dataType);
        this._readOnly = readOnly;
        this._primaryKey = primaryKey;
        this._defaultValue = DataTypeValidator.resolve(dataType).defaultValue;
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

    set nonStored(value : boolean) {
        this._nonStored = value;
    }

    get model() {
        return this._model;
    }

    static deserializeStructure(obj : any) {
        let fieldName = FormatError.getValueOrThrow<string>(obj, Field.NAME_KEY);
        let dataType = FormatError.getValueOrThrow<DataType>(obj, Field.DATATYPE_KEY);
        let primaryKey = FormatError.getValueOrThrow<boolean>(obj, Field.PRIMARYKEY_KEY);
        let readOnly = FormatError.getValueOrThrow<boolean>(obj, Field.READONLY_KEY);
        let nonStored = FormatError.getValueOrThrow<boolean>(obj, Field.NONSTORED_KEY);

        let field = new Field(fieldName, dataType, readOnly, primaryKey);
        field.nonStored = nonStored;

        return field;
    }

    /**
     * 
     * @param model 
     * @internal
     */
    setModel(model : Model) {
        this._model = model;
    }

    serializeStructure() {
        let obj: {[k: string]: any} = {};

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

module.exports = {Field};