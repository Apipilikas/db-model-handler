import { Field } from "../field";
import { Model } from "../model";
import { DataType } from "../utils/dataTypeValidator";
import {AlreadyInitializedModelError, NotInitializedModelError} from "../utils/errors";

describe("Testing Field", () => {
    test("Push field before initialization", testField1);
    test("Field : serializeStructure", testField_serializeStructure);
    test("Field : deserializeStructure", testField_deserializeStructure);
    test("Field : stringify", testField_stringify);
})

class DummyModel extends Model {
    private _field : Field
    private _field2 : Field
    constructor() {
        super("Dummy");
    }

    override initModel(): void {
        this._field = this.pushNewField("fld", String, true, true);
        this._field2 = this.pushNewField("fld2", String, false, false);
        this._field2.nullable = true;
    }

    get field() {
        return this._field;
    }
}

function testField1() {
    expect(() => new DummyModel()).not.toThrow(AlreadyInitializedModelError);
}

function testField_serializeStructure() {
    let obj = {
        [Field.NAME_KEY] : "field_test",
        [Field.DATATYPE_KEY] : DataType.STRING,
        [Field.PRIMARYKEY_KEY] : false,
        [Field.READONLY_KEY] : false,
        [Field.NONSTORED_KEY] : true
    };

    let field = Field.deserializeStructure(obj);
    expect(field.fieldName).toBe("field_test");
    expect(field.dataType).toBe(DataType.STRING);
    expect(field.primaryKey).toBeFalsy();
    expect(field.readOnly).toBeFalsy();
    expect(field.nonStored).toBeTruthy();
}

function testField_deserializeStructure() {
    let obj : {[k : string] : any} = {
        [Field.NAME_KEY] : "field_test",
        [Field.DATATYPE_KEY] : DataType.STRING,
        [Field.PRIMARYKEY_KEY] : false,
        [Field.READONLY_KEY] : false,
        [Field.NONSTORED_KEY] : true
    };

    let field = new Field("field_test", String, false, false);
    field.nonStored = true;
    expect(field.serializeStructure()).toStrictEqual(obj);
}

function testField_stringify() {
    let dm = new DummyModel();
    expect(dm.field.stringify()).toBe('{\"fieldName\":\"fld\",\"dataType\":\"string\",\"primaryKey\":true,\"readOnly\":true,\"nonStored\":false}');
}

function testField_nullable() {
    let dm = new DummyModel();
    expect(dm.field.stringify()).toBe('{\"fieldName\":\"fld\",\"dataType\":\"string\",\"primaryKey\":true,\"readOnly\":true,\"nonStored\":false}');
}