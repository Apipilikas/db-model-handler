import { Model } from "./model";
import { DataType } from "./utils/dataTypeValidator";
export declare class Field {
    static NAME_KEY: string;
    static DATATYPE_KEY: string;
    static PRIMARYKEY_KEY: string;
    static READONLY_KEY: string;
    static NONSTORED_KEY: string;
    private _fieldName;
    private _dataType;
    private _primaryKey;
    private _readOnly;
    private _nonStored;
    private _defaultValue;
    private _nullable;
    private _model;
    /**
     * @constructor Field constructor
     * @param fieldName The field name
     * @param dataType The data type
     * @param readOnly The read only
     * @param primaryKey The primary key
     */
    constructor(fieldName: string, dataType: string | object | DataType, readOnly?: boolean, primaryKey?: boolean);
    get fieldName(): string;
    get dataType(): DataType;
    get primaryKey(): boolean;
    get readOnly(): boolean;
    get defaultValue(): any;
    set defaultValue(value: any);
    get nonStored(): boolean;
    set nonStored(value: boolean);
    get nullable(): boolean;
    set nullable(value: boolean);
    get model(): Model;
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
    static deserializeStructure(obj: any): Field;
    /**
     * Serializes Field structure into JSON format.
     */
    serializeStructure(): any;
    /**
     * Gets serialized Field.
     */
    stringify(): string;
}
//# sourceMappingURL=field.d.ts.map