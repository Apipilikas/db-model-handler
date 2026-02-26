import { BooleanValidator, DataType, DataTypeValidator, IDataTypeValidator, NumberValidator, StringValidator } from "../utils/dataTypeValidator"

describe("Testing data type validator", () => {
    test("Data type validator : isNumber", testDataTypeValidator_isNumber);
    test("Data type validator : toNumber", testDataTypeValidator_toNumber);

    test("Data type validator : isFloat", testDataTypeValidator_isFloat);
    test("Data type validator : toFloat", testDataTypeValidator_toFloat);

    test("Data type validator : isInt", testDataTypeValidator_isInt);
    test("Data type validator : toInt", testDataTypeValidator_toInt);

    test("Data type validator : isNull", testDataTypeValidator_isNull);
    
    test("Data type validator : isString", testDataTypeValidator_isString);
    test("Data type validator : toString", testDataTypeValidator_toString);

    test("Data type validator : isBoolean", testDataTypeValidator_isBoolean);
    test("Data type validator : toBoolean", testDataTypeValidator_toBoolean);

    test("Data type validator : isUndefined", testDataTypeValidator_isUndefined);

    test("Data type validator : validate", testDataTypeValidator_validate);
    
    test("Number validator", testNumberValidator);
    test("Float validator", testFloatValidator);
    test("String validator", testStringValidator);
    test("Boolean validator", testBooleanValidator);
})

function testDataTypeValidator_isNumber() {
    expect(DataTypeValidator.isNumber("testing")).toBeFalsy();
    expect(DataTypeValidator.isNumber("2")).toBeFalsy()
    expect(DataTypeValidator.isNumber(2)).toBeTruthy();
    expect(DataTypeValidator.isNumber(-2)).toBeTruthy();
    expect(DataTypeValidator.isNumber(NaN)).toBeTruthy();
    expect(DataTypeValidator.isNumber(0)).toBeTruthy();
    expect(DataTypeValidator.isNumber(0.0)).toBeTruthy();
}

function testDataTypeValidator_toNumber() {
    expect(DataTypeValidator.toNumber("test")).toBe(Number.NaN);
    expect(DataTypeValidator.toNumber("1")).toBe(1);
    expect(DataTypeValidator.toNumber("1.1")).toBe(1.1);
    expect(DataTypeValidator.toNumber(NaN)).toBe(NaN);
    expect(DataTypeValidator.toNumber(null)).toBe(0);
    expect(DataTypeValidator.toNumber(undefined)).toBe(Number.NaN);
}

function testDataTypeValidator_isFloat() {
    expect(DataTypeValidator.isFloat("2.2")).toBeFalsy();
    expect(DataTypeValidator.isFloat(2.2)).toBeTruthy();
    expect(DataTypeValidator.isFloat(0.0)).toBeTruthy();
    expect(DataTypeValidator.isFloat(0)).toBeTruthy();
    expect(DataTypeValidator.isFloat(2)).toBeFalsy();
}

function testDataTypeValidator_toFloat() {
    expect(DataTypeValidator.toFloat("1")).toBe(Number.NaN);
    expect(DataTypeValidator.toFloat("test")).toBe(Number.NaN);
    expect(DataTypeValidator.toFloat("1.1")).toBe(1.1);
    expect(DataTypeValidator.toFloat(null)).toBe(0.0);
    expect(DataTypeValidator.toFloat(undefined)).toBe(0.0);
}

function testDataTypeValidator_isInt() {
    expect(DataTypeValidator.isInt("1")).toBeFalsy();
    expect(DataTypeValidator.isInt(1)).toBeTruthy();
    expect(DataTypeValidator.isInt(1.1)).toBeFalsy();
}

function testDataTypeValidator_toInt() {
    expect(DataTypeValidator.toInt("1")).toBe(1);
    expect(DataTypeValidator.toInt("1.1")).toBe(Number.NaN);
    expect(DataTypeValidator.toInt("test")).toBe(Number.NaN);
    expect(DataTypeValidator.toInt(null)).toBe(0);
    expect(DataTypeValidator.toInt(undefined)).toBe(0);
}

function testDataTypeValidator_isNull() {
    expect(DataTypeValidator.isNull("1")).toBeFalsy();
    expect(DataTypeValidator.isNull(null)).toBeTruthy();
    expect(DataTypeValidator.isNull("null")).toBeFalsy();
}

function testDataTypeValidator_isString() {
    expect(DataTypeValidator.isString(2)).toBeFalsy();
    expect(DataTypeValidator.isString("hi")).toBeTruthy();
    expect(DataTypeValidator.isString(null)).toBeFalsy();
}

function testDataTypeValidator_toString() {
    expect(DataTypeValidator.toString(2)).toBe("2")
    expect(DataTypeValidator.toString(true)).toBe("true");
    expect(DataTypeValidator.toString(null)).toBe("null");
    expect(DataTypeValidator.toString(undefined)).toBe("undefined");
    expect(DataTypeValidator.toString(1 == 1)).toBe("true");
}

function testDataTypeValidator_isBoolean() {
    expect(DataTypeValidator.isBoolean(2)).toBeFalsy();
    expect(DataTypeValidator.isBoolean(true)).toBeTruthy();
    expect(DataTypeValidator.isBoolean(null)).toBeFalsy();
}

function testDataTypeValidator_toBoolean() {
    expect(DataTypeValidator.toBoolean(2)).toBe(true);
    expect(DataTypeValidator.toBoolean(0)).toBe(false);
    expect(DataTypeValidator.toBoolean("true")).toBe(true);
    expect(DataTypeValidator.toBoolean("false")).toBe(true);
    expect(DataTypeValidator.toBoolean(null)).toBe(false);
    expect(DataTypeValidator.toBoolean(undefined)).toBe(false);
}

function testDataTypeValidator_isUndefined() {
    expect(DataTypeValidator.isUndefined(2)).toBeFalsy();
    expect(DataTypeValidator.isUndefined(undefined)).toBeTruthy();
    expect(DataTypeValidator.isUndefined(null)).toBeFalsy();
}

function testDataTypeValidator_validate() {
    expect(DataTypeValidator.validate(Number, 1)).toBeTruthy();
    expect(DataTypeValidator.validate(DataType.INT, 2.3)).toBeFalsy();
    expect(DataTypeValidator.validate(DataType.FLOAT, 2.5)).toBeTruthy();
    expect(DataTypeValidator.validate(Boolean, true)).toBeTruthy();
    expect(DataTypeValidator.validate(String, "hello")).toBeTruthy();
}

function testNumberValidator() {
    let dt = DataTypeValidator.resolve(Number);
    expect(dt.dataType).toBe(DataType.NUMBER);

    dt = DataTypeValidator.resolve("Number");
    expect(dt.dataType).toBe(DataType.NUMBER);

    dt = DataTypeValidator.resolve(DataType.NUMBER);
    expect(dt.dataType).toBe(DataType.NUMBER);

    // isValid
    expect(dt.isValid(1)).toBeTruthy();
    expect(dt.isValid("test")).toBeFalsy();

    // defaultValue
    expect(dt.defaultValue).toBe(0);

    // NumberValidator.isNaN
    expect(NumberValidator.isNaN(0/0)).toBe(true);
}

function testFloatValidator() {
    let dt = DataTypeValidator.resolve(DataType.FLOAT);
    expect(dt.dataType).toBe(DataType.FLOAT);

    dt = DataTypeValidator.resolve("Float");
    expect(dt.dataType).toBe(DataType.FLOAT);

    // isValid
    expect(dt.isValid(1.1)).toBeTruthy();
    expect(dt.isValid(2)).toBeFalsy();
    expect(dt.isValid(null)).toBeFalsy();
    expect(dt.isValid(undefined)).toBeFalsy();
    expect(dt.isValid(0.0)).toBeTruthy();

    // defaultValue
    expect(dt.defaultValue).toBe(0.0);
}

function testStringValidator() {
    let dt = DataTypeValidator.resolve(String);
    expect(dt.dataType).toBe(DataType.STRING);

    dt = DataTypeValidator.resolve("String");
    expect(dt.dataType).toBe(DataType.STRING);

    dt = DataTypeValidator.resolve(DataType.STRING);
    expect(dt.dataType).toBe(DataType.STRING);

    // isValid
    expect(dt.isValid("test")).toBeTruthy();
    expect(dt.isValid(1)).toBeFalsy();

    // defaultValue
    expect(dt.defaultValue).toBe(StringValidator.empty);

    // StringValidator.isEmpty
    expect(StringValidator.isEmpty("")).toBeTruthy();
    expect(StringValidator.isEmpty(1)).toBeFalsy();
}

function testBooleanValidator() {
    let dt = DataTypeValidator.resolve(Boolean);
    expect(dt.dataType).toBe(DataType.BOOLEAN);

    dt = DataTypeValidator.resolve("Boolean");
    expect(dt.dataType).toBe(DataType.BOOLEAN);

    dt = DataTypeValidator.resolve(DataType.BOOLEAN);
    expect(dt.dataType).toBe(DataType.BOOLEAN);

    // isValid
    expect(dt.isValid("true")).toBeFalsy();
    expect(dt.isValid(true)).toBeTruthy();
    expect(dt.isValid(false)).toBeTruthy();
    expect(dt.isValid(1)).toBeFalsy();
    expect(dt.isValid(0.0)).toBeFalsy();

    // defaultValue
    expect(dt.defaultValue).toBe(false);

    // BooleanValidator.isTrue
    expect(BooleanValidator.isTrue("true")).toBeFalsy();
    expect(BooleanValidator.isTrue(true)).toBeTruthy();
    expect(BooleanValidator.isTrue(false)).toBeFalsy();
    expect(BooleanValidator.isTrue(1)).toBeFalsy();
    expect(BooleanValidator.isTrue(2.2)).toBeFalsy();

    // BooleanValidator.isFalse
    expect(BooleanValidator.isFalse("false")).toBeFalsy();
    expect(BooleanValidator.isFalse(false)).toBeTruthy();
    expect(BooleanValidator.isFalse(true)).toBeFalsy();
    expect(BooleanValidator.isFalse(1)).toBeFalsy();
    expect(BooleanValidator.isFalse(2.2)).toBeFalsy();

    // BooleanValidator.parseValue
    let bv = new BooleanValidator();
    expect(bv.parseValue(false)).toBeFalsy();
    expect(bv.parseValue(true)).toBeTruthy();
    expect(bv.parseValue("true")).toBeFalsy();
    expect(bv.parseValue(1)).toBeFalsy();
    expect(bv.parseValue(2.2)).toBeFalsy();
}