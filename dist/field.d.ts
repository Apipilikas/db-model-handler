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
    private _model;
    constructor(fieldName: string, dataType: string | object | DataType, readOnly?: boolean, primaryKey?: boolean);
    get fieldName(): string;
    get dataType(): DataType;
    get primaryKey(): boolean;
    get readOnly(): boolean;
    get defaultValue(): any;
    get nonStored(): boolean;
    set nonStored(value: boolean);
    get model(): Model;
    static deserializeStructure(obj: any): Field;
    serializeStructure(): {
        [k: string]: any;
    };
    stringify(): string;
}
//# sourceMappingURL=field.d.ts.map