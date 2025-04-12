export enum DataType {
    NUMBER = "number",
    INT = "int",
    BIGINT = "bigint",
    FLOAT = "float",
    BOOLEAN = "boolean",
    STRING = "string",
    OBJECT = "object"
}

export interface IDataTypeValidator {
    dataType : DataType
    defaultValue : any
    isValid(value : any) : boolean
    parseValue(value : any) : any
    toString(value : any) : string
}

export class DataTypeValidator implements IDataTypeValidator {
    private _dataType : DataType

    constructor(dataType : DataType) {
        this._dataType = dataType;
    }

    get dataType() {
        return this._dataType;
    }

    get defaultValue() : any { 
        return null; 
    }

    static isString(value : any) : boolean {
        return typeof(value) === String.name.toLowerCase();
    }

    static isNumber(value : any) {
        return typeof(value) === Number.name.toLowerCase();
    }

    static isInt(value : any) : boolean {
        return Number.isInteger(value);
    }

    static isFloat(value : any) : boolean {
        return this.isNumber(value) && (value === 0 || value % 1 !== 0);
    }

    static isBigInt(value : any) : boolean {
        return typeof(value) === DataType.BIGINT;
    }

    static isBoolean(value : any) {
        return typeof(value) === DataType.BOOLEAN;
    }

    static isNull(value : any) {
        return value === null;
    }

    static isUndefined(value : any) {
        return value === undefined;
    }

    isValid(value : any) : boolean {
        return typeof(value) == this._dataType.toLowerCase();
    }

    parseValue(value : any) {
        return value;
    }

    static toString(value : any) {
        return new String(value).toString();
    }

    static toNumber(value : any) : number {
        return new Number(value).valueOf();
    }

    static toInt(value : any) : number {
        if (this.isNull(value) || this.isUndefined(value)) return 0;

        let number = this.toNumber(value);
        if (!Number.isInteger(number))return Number.NaN;

        return number;
    }

    static toFloat(value : any) : number {
        if (this.isNull(value) || this.isUndefined(value)) return 0.0;

        let number = this.toNumber(value);
        if (Number.isInteger(number)) return Number.NaN;

        return number;
    }

    static toBigInt(value : any) : bigint {
        return BigInt(value);
    }

    static toBoolean(value : any) : boolean {
        return new Boolean(value).valueOf();
    }

    static getDataType(dataType : string | object | DataType) : DataType {
        if (this.isString(dataType)) dataType = dataType.toString().toLowerCase();

        switch (dataType) {
            case "number" :
            case Number : return DataType.NUMBER;
            case "boolean" :
            case Boolean : return DataType.BOOLEAN;
            case "string" :
            case String : return DataType.STRING;
            case "float" : return DataType.FLOAT;
            default : return DataType.OBJECT;   
        }
    }

    static validate(dataType : string | object | DataType, value : any) {
        return this.resolve(dataType).isValid(value);
    }

    static resolve(dataType : string | object | DataType) : IDataTypeValidator {
        let dataTypeName = this.getDataType(dataType);
        
        switch (dataTypeName.toLowerCase()) {
            case DataType.NUMBER: return new NumberValidator();
            case DataType.FLOAT: return new FloatValidator();
            case DataType.BOOLEAN: return new BooleanValidator();
            case DataType.STRING: return new StringValidator();
            default: return new DataTypeValidator(DataType.OBJECT);
        }
    }
}

export class NumberValidator extends DataTypeValidator implements IDataTypeValidator {
    constructor() { super(DataType.NUMBER) }

    override parseValue(value : any) : number {
        let parsedValue = parseInt(NumberValidator.toString(value));
        if (NumberValidator.isNull(value) || NumberValidator.isNaN(parsedValue)) return this.defaultValue;
        return parsedValue;
    }

    override get defaultValue() : number { 
        return 0; 
    }

    static isNaN(value : any) : boolean {
        return Number.isNaN(value);
    }
}

export class FloatValidator extends DataTypeValidator implements IDataTypeValidator {
    constructor() { super(DataType.FLOAT) }

    override parseValue(value : any) : number {
        if (FloatValidator.isNull(value)) return this.defaultValue;
        return parseFloat(FloatValidator.toString(value));
    }

    override isValid(value: any): boolean {
         return DataTypeValidator.isFloat(value);
    }

    get defaultValue() : number {
        return 0.0;
    }
}

export class BooleanValidator extends DataTypeValidator implements IDataTypeValidator {
    constructor() { super(DataType.BOOLEAN) }

    override parseValue(value : any) : boolean {
        if (!BooleanValidator.isBoolean(value)) return this.defaultValue;
        return Boolean(value);
    }

    override get defaultValue() : boolean { 
        return false; 
    }

    static isTrue(value : any) : boolean {
        return this.isBoolean(value) && value === true;
    }

    static isFalse(value : any) : boolean {
        return this.isBoolean(value) && value === false;
    }
}

export class StringValidator extends DataTypeValidator implements IDataTypeValidator {
    static empty : string = ""

    constructor() { super(DataType.STRING) }

    override parseValue(value: any) : string {
        return StringValidator.toString(value);
    }

    override get defaultValue() : string { 
        return StringValidator.empty; 
    }

    static isEmpty(value : any) : boolean {
        return !this.isNull(value) && !this.isUndefined(value) && value === StringValidator.empty;
    }
}