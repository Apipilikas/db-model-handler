export declare enum DataType {
    NUMBER = "number",
    INT = "int",
    BIGINT = "bigint",
    FLOAT = "float",
    BOOLEAN = "boolean",
    STRING = "string",
    OBJECT = "object"
}
export interface IDataTypeValidator {
    dataType: DataType;
    defaultValue: any;
    isValid(value: any): boolean;
    parseValue(value: any): any;
    toString(value: any): string;
}
export declare class DataTypeValidator implements IDataTypeValidator {
    private _dataType;
    constructor(dataType: DataType);
    get dataType(): DataType;
    get defaultValue(): any;
    static isString(value: any): boolean;
    static isNumber(value: any): boolean;
    static isInt(value: any): boolean;
    static isFloat(value: any): boolean;
    static isBigInt(value: any): boolean;
    static isBoolean(value: any): boolean;
    static isNull(value: any): boolean;
    static isUndefined(value: any): boolean;
    isValid(value: any): boolean;
    parseValue(value: any): any;
    static toString(value: any): string;
    static toNumber(value: any): number;
    static toInt(value: any): number;
    static toFloat(value: any): number;
    static toBigInt(value: any): bigint;
    static toBoolean(value: any): boolean;
    static getDataType(dataType: string | object | DataType): DataType;
    static validate(dataType: string | object | DataType, value: any): boolean;
    static resolve(dataType: string | object | DataType): IDataTypeValidator;
}
export declare class NumberValidator extends DataTypeValidator implements IDataTypeValidator {
    constructor();
    parseValue(value: any): number;
    get defaultValue(): number;
    static isNaN(value: any): boolean;
}
export declare class FloatValidator extends DataTypeValidator implements IDataTypeValidator {
    constructor();
    parseValue(value: any): number;
    isValid(value: any): boolean;
    get defaultValue(): number;
}
export declare class BooleanValidator extends DataTypeValidator implements IDataTypeValidator {
    constructor();
    parseValue(value: any): boolean;
    get defaultValue(): boolean;
    static isTrue(value: any): boolean;
    static isFalse(value: any): boolean;
}
export declare class StringValidator extends DataTypeValidator implements IDataTypeValidator {
    static empty: string;
    constructor();
    parseValue(value: any): string;
    get defaultValue(): string;
    static isEmpty(value: any): boolean;
}
//# sourceMappingURL=dataTypeValidator.d.ts.map