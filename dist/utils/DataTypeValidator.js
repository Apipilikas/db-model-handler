"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringValidator = exports.BooleanValidator = exports.FloatValidator = exports.NumberValidator = exports.DataTypeValidator = exports.DataType = void 0;
var DataType;
(function (DataType) {
    DataType["NUMBER"] = "number";
    DataType["INT"] = "int";
    DataType["BIGINT"] = "bigint";
    DataType["FLOAT"] = "float";
    DataType["BOOLEAN"] = "boolean";
    DataType["STRING"] = "string";
    DataType["OBJECT"] = "object";
})(DataType || (exports.DataType = DataType = {}));
class DataTypeValidator {
    constructor(dataType) {
        this._dataType = dataType;
    }
    get dataType() {
        return this._dataType;
    }
    get defaultValue() {
        return null;
    }
    static isString(value) {
        return typeof (value) === String.name.toLowerCase();
    }
    static isNumber(value) {
        return typeof (value) === Number.name.toLowerCase();
    }
    static isInt(value) {
        return Number.isInteger(value);
    }
    static isFloat(value) {
        return this.isNumber(value) && (value === 0 || value % 1 !== 0);
    }
    static isBigInt(value) {
        return typeof (value) === DataType.BIGINT;
    }
    static isBoolean(value) {
        return typeof (value) === DataType.BOOLEAN;
    }
    static isNull(value) {
        return value === null;
    }
    static isUndefined(value) {
        return value === undefined;
    }
    isValid(value) {
        return typeof (value) == this._dataType.toLowerCase();
    }
    parseValue(value) {
        return value;
    }
    static toString(value) {
        return new String(value).toString();
    }
    static toNumber(value) {
        return new Number(value).valueOf();
    }
    static toInt(value) {
        if (this.isNull(value) || this.isUndefined(value))
            return 0;
        let number = this.toNumber(value);
        if (!Number.isInteger(number))
            return Number.NaN;
        return number;
    }
    static toFloat(value) {
        if (this.isNull(value) || this.isUndefined(value))
            return 0.0;
        let number = this.toNumber(value);
        if (Number.isInteger(number))
            return Number.NaN;
        return number;
    }
    static toBigInt(value) {
        return BigInt(value);
    }
    static toBoolean(value) {
        return new Boolean(value).valueOf();
    }
    static getDataType(dataType) {
        if (this.isString(dataType))
            dataType = dataType.toString().toLowerCase();
        switch (dataType) {
            case "number":
            case Number: return DataType.NUMBER;
            case "boolean":
            case Boolean: return DataType.BOOLEAN;
            case "string":
            case String: return DataType.STRING;
            case "float": return DataType.FLOAT;
            default: return DataType.OBJECT;
        }
    }
    static validate(dataType, value) {
        return this.resolve(dataType).isValid(value);
    }
    static resolve(dataType) {
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
exports.DataTypeValidator = DataTypeValidator;
class NumberValidator extends DataTypeValidator {
    constructor() { super(DataType.NUMBER); }
    parseValue(value) {
        let parsedValue = parseInt(NumberValidator.toString(value));
        if (NumberValidator.isNull(value) || NumberValidator.isNaN(parsedValue))
            return this.defaultValue;
        return parsedValue;
    }
    get defaultValue() {
        return 0;
    }
    static isNaN(value) {
        return Number.isNaN(value);
    }
}
exports.NumberValidator = NumberValidator;
class FloatValidator extends DataTypeValidator {
    constructor() { super(DataType.FLOAT); }
    parseValue(value) {
        if (FloatValidator.isNull(value))
            return this.defaultValue;
        return parseFloat(FloatValidator.toString(value));
    }
    isValid(value) {
        return DataTypeValidator.isFloat(value);
    }
    get defaultValue() {
        return 0.0;
    }
}
exports.FloatValidator = FloatValidator;
class BooleanValidator extends DataTypeValidator {
    constructor() { super(DataType.BOOLEAN); }
    parseValue(value) {
        if (!BooleanValidator.isBoolean(value))
            return this.defaultValue;
        return Boolean(value);
    }
    get defaultValue() {
        return false;
    }
    static isTrue(value) {
        return this.isBoolean(value) && value === true;
    }
    static isFalse(value) {
        return this.isBoolean(value) && value === false;
    }
}
exports.BooleanValidator = BooleanValidator;
class StringValidator extends DataTypeValidator {
    constructor() { super(DataType.STRING); }
    parseValue(value) {
        return StringValidator.toString(value);
    }
    get defaultValue() {
        return StringValidator.empty;
    }
    static isEmpty(value) {
        return !this.isNull(value) && !this.isUndefined(value) && value === StringValidator.empty;
    }
}
exports.StringValidator = StringValidator;
StringValidator.empty = "";
