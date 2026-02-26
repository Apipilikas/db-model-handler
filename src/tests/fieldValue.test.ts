import { Field } from "../field";
import { FieldValue, FieldValueVersion } from "../fieldValue";
import { Model } from "../model";
import { StringValidator } from "../utils/dataTypeValidator";
import { ReadOnlyFieldError, ValueValidationError } from "../utils/errors";

class DummyModel extends Model {
    private _fld1 : Field;
    private _fld2 : Field;
    private _fld3 : Field;

    constructor() {
        super("Dummy");
    }

    override initModel(): void {
        this._fld1 = this.pushNewField("fld 1", String, true, true);
        this._fld2 = this.pushNewField("fld 2", Number, false, false);
        this._fld3 = this.pushNewField("fld 3", String, true, false);
    }

    get field1() {
        return this._fld1;
    }

    get field2() {
        return this._fld2;
    }

    get field3() {
        return this._fld3;
    }
}

let dm = new DummyModel();

describe("Testing FieldValue", () => {
    test("FieldValue : new", testFieldValue_new);
    test("FieldValue : loadData", testFieldValue_loadData);
    test("FieldValue : copy", testFieldValue_copy);
    test("FieldValue : hasChanges", testFieldValue_hasChanged);
    test("FieldValue : readOnly", testFieldValue_readOnly);
})

function testFieldValue_new() {
    let fv = FieldValue.new(dm.field1);
    expect(fv.value).toBe(dm.field1.defaultValue);
    expect(fv.getValue(FieldValueVersion.CURRENT)).toBe(dm.field1.defaultValue);
    expect(fv.getValue(FieldValueVersion.ORIGINAL)).toBe(dm.field1.defaultValue);
    expect(fv.getValue(FieldValueVersion.DEFAULT)).toBe(dm.field1.defaultValue);
}

function testFieldValue_loadData() {
    let fv = FieldValue.loadData(dm.field1, 2);

    // String field
    expect(fv.value).toBe("2");
    expect(fv.value).not.toBe(2);
    expect(fv.getValue(FieldValueVersion.CURRENT)).toBe("2");
    expect(fv.getValue(FieldValueVersion.ORIGINAL)).toBe("2");
    expect(fv.getValue(FieldValueVersion.DEFAULT)).toBe(StringValidator.empty);

    // Number field
    fv = FieldValue.loadData(dm.field2, 2);
    expect(fv.value).not.toBe("2");
    expect(fv.value).toBe(2);
    expect(fv.getValue(FieldValueVersion.CURRENT)).toBe(2);
    expect(fv.getValue(FieldValueVersion.ORIGINAL)).toBe(2);
    expect(fv.getValue(FieldValueVersion.DEFAULT)).toBe(0);
}

function testFieldValue_copy() {
    let fv = FieldValue.loadData(dm.field1, "code");
    let cfv = FieldValue.copy(dm.field1, fv);
    expect(fv.value).toBe("code");
    expect(fv.getValue(FieldValueVersion.CURRENT)).toBe("code");
    expect(fv.getValue(FieldValueVersion.ORIGINAL)).toBe("code");
    expect(fv.getValue(FieldValueVersion.DEFAULT)).toBe(StringValidator.empty);

    expect(cfv.value).toBe("code");
    expect(cfv.getValue(FieldValueVersion.CURRENT)).toBe("code");
    expect(cfv.getValue(FieldValueVersion.ORIGINAL)).toBe("code");
    expect(cfv.getValue(FieldValueVersion.DEFAULT)).toBe(StringValidator.empty);
}

function testFieldValue_hasChanged() {
    let fv = FieldValue.loadData(dm.field1, 2);

    // String field
    expect(() => fv.value = 3).toThrow(Error);

    // Number field - acceptChange
    fv = FieldValue.loadData(dm.field2, 2);
    fv.value = 4;
    expect(fv.value).toBe(4);
    expect(() => fv.value = "3").toThrow(ValueValidationError);
    expect(fv.getValue(FieldValueVersion.CURRENT)).toBe(4);
    expect(fv.getValue(FieldValueVersion.ORIGINAL)).toBe(2);
    expect(fv.hasChanged()).toBeTruthy();
    fv.acceptChange();
    expect(fv.getValue(FieldValueVersion.CURRENT)).toBe(4);
    expect(fv.getValue(FieldValueVersion.ORIGINAL)).toBe(4);
    expect(fv.hasChanged()).toBeFalsy();

    // Number field - rejectChange
    fv.value = 6;
    expect(fv.value).toBe(6);
    expect(fv.getValue(FieldValueVersion.CURRENT)).toBe(6);
    expect(fv.getValue(FieldValueVersion.ORIGINAL)).toBe(4);
    expect(fv.hasChanged()).toBeTruthy();
    fv.rejectChange();
    expect(fv.getValue(FieldValueVersion.CURRENT)).toBe(4);
    expect(fv.getValue(FieldValueVersion.ORIGINAL)).toBe(4);
    expect(fv.hasChanged()).toBeFalsy();
}

function testFieldValue_readOnly() {
    let fv = FieldValue.loadData(dm.field3, "testing");
    expect(() => fv.value = "3").toThrow(ReadOnlyFieldError);
}