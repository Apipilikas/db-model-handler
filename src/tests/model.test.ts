import { Field } from "../field";
import { FieldValueVersion } from "../fieldValue";
import { Model } from "../model";
import { Record, RecordState } from "../record";
import { AlreadyInitializedModelError, MergeModelError, NotInitializedModelError } from "../utils/errors";
import { RecordDeletedEventArgs, RecordDeletingEventArgs, ValueChangeEventArgs } from "../events/eventArgs";


class TestModel1 extends Model {
    private _codeField : Field
    private _nameField : Field
    private _totalVotes : Field

    constructor() {
        super("Test1");

    }

    override initModel(): void {
        this._codeField = this.pushNewField("code", String, false, true);
        this._nameField = this.pushNewField("name", String, false, false);
        this._nameField.nonStored = true;
        this._totalVotes = this.pushNewField("totalVotes", Number, false, false);
    }

    get codeField() {
        return this._codeField;
    }

    get nameField() {
        return this._nameField;
    }
}

class TestModel2 extends Model {
    private _codeField : Field
    private _nameField : Field
    private _totalVotes : Field

    constructor() {
        super("Test2");

    }

    override initModel(): void {
        this._codeField = this.pushNewField("code", String, false, true);
        this._nameField = this.pushNewField("name", String, false, false);
        this._nameField.nonStored = true;
        this._totalVotes = this.pushNewField("totalVote", Number, false, false);
    }

    get codeField() {
        return this._codeField;
    }

    get nameField() {
        return this._nameField;
    }
}

class TestModel3 extends Model {
    private _codeField : Field
    private _nameField : Field
    private _totalVotes : Field

    constructor() {
        super("Test3");

    }

    override initModel(): void {
        this._codeField = this.pushNewField("code", String, false, true);
        this._nameField = this.pushNewField("name", String, false, false);
        this._nameField.nonStored = true;
        this._totalVotes = this.pushNewField("totalVotes", Number, false, false);
        this.pushNewField("dummy", String, false, false);
    }

    get codeField() {
        return this._codeField;
    }

    get nameField() {
        return this._nameField;
    }
}

class TestModel4 extends Model {
    private _codeField : Field
    private _nameField : Field
    private _totalVotes : Field

    constructor() {
        super("Test4");

    }

    override initModel(): void {
        this._codeField = this.pushNewField("code", String, false, true);
        this._nameField = this.pushNewField("name", String, false, false);
        this._nameField.nonStored = true;
        this._totalVotes = this.pushNewField("totalVotes", Number, false, false);

        this.valueChanging.addListener(this.onValueChangingEvent);
        this.valueChanged.addListener(this.onValueChangedEvent);
        this.recordDeleting.addListener(this.onRecordDeletingEvent);
        this.recordDeleted.addListener(this.onRecordDeletedEvent);
    }

    get codeField() {
        return this._codeField;
    }

    get nameField() {
        return this._nameField;
    }

    onValueChangingEvent(arg : ValueChangeEventArgs) {

        switch (arg.field.fieldName) {
            case this.codeField.fieldName:
                if (arg.proposedValue == "code1") {
                    arg.proposedValue = "code1_changing";
                }
        }
    }

    onValueChangedEvent(arg : ValueChangeEventArgs) {

        switch(arg.field.fieldName) {
            case this.codeField.fieldName:
                if (arg.proposedValue == "code1_changed") {
                    arg.record.setValue("name", "name_changed");
                }
        }
    }

    onRecordDeletingEvent(arg : RecordDeletingEventArgs) {
        if (arg.record.getValue("code") == "code1") {
            arg.cancel = true;
        }
    }

    onRecordDeletedEvent(arg : RecordDeletedEventArgs) {
        if (arg.record.getValue("code", FieldValueVersion.ORIGINAL) == "code1_throw") {
            throw new Error("DELETED");
        }
    }
}

describe("Testing model",() => {
    test('Model : not initialized initModel', testModel_NotInitializedModel_Error);
    test('Model : initialized', testModel2);
    test('Model : serialize', testModel_serialize);
    test('Model : deserialize', testModel_deserialize);
    test("Model : getChanges", testModel_getChanges);
    test("Model : getChangesForSave", testModel_getChangesForSave);
    test("Model : merge", testModel_merge);
    test("Model : acceptChanges", testModel_acceptChanges);

    // EVENTS
    test("Model : valueChangingEvent", testModel_valueChangingEvent);
    test("Model : valueChangedEvent", testModel_valueChangedEvent);
    test("Model : recordDeletingEvent", testModel_recordDeletingEvent);
    test("Model : recordDeletedEvent", testModel_recordDeletedEvent);
});

function testModel_NotInitializedModel_Error() {
    expect(() => new Model("Test")).toThrow(NotInitializedModelError);
}

function testModel2() {
    let m : TestModel1;
    expect(() => {
        m = new TestModel1();
    }).not.toThrow(NotInitializedModelError);
    
    expect(() => m.pushNewField("test", Number, true, true)).toThrow(AlreadyInitializedModelError);
}

function testModel_serialize() {
    let m = new TestModel1();
    m.pushNewRecord("code1", "name1", 10);
    let serializedObj = m.serialize();
    expect(serializedObj[Model.RECORDS_KEY][0][Record.STATE_KEY] as RecordState).toBe(RecordState.ADDED);
    expect(serializedObj[Model.RECORDS_KEY][0][Record.CURRENT_VALUES_KEY]["code"]).toBe("code1");
    expect(serializedObj[Model.RECORDS_KEY][0][Record.CURRENT_VALUES_KEY]["name"]).toBe("name1");
    expect(serializedObj[Model.RECORDS_KEY][0][Record.CURRENT_VALUES_KEY]["totalVotes"]).toBe(10);
}

function testModel_deserialize() {
    let m = new TestModel1();
    m.deserialize('{\"records\":[{\"state\":1,\"current\":{\"code\":\"code1\",\"name\":\"name1\",\"totalVotes\":0}}]}');
    expect(m.records[0].state).toBe(RecordState.ADDED);
    expect(m.records[0].getValue("code")).toBe("code1");
    expect(m.records[0].getValue("name")).toBe("name1");
}

function testModel_getChanges() {
    let m = new TestModel1();
    let r1 = m.pushNewRecord("code1", "name1", 1);
    let r2 = m.loadRecord("code2", "name2", 2);
    r2.setValue("name", "name2_m");
    let r3 = m.loadRecord("code3", "name3", 3);
    let r4 = m.loadRecord("code4", "name4", 4);
    r4.delete();
    let changes = m.getChanges();

    // ADDED
    expect(changes[0][Record.STATE_KEY] as RecordState).toBe(RecordState.ADDED);
    expect(changes[0][Record.VALUES_KEY]["name"]).toBe("name1");
    expect(Object.keys(changes[0][Record.VALUES_KEY]).length).toBe(m.fields.length);
    
    // MODIFIED
    expect(changes[1][Record.STATE_KEY] as RecordState).toBe(RecordState.MODIFIED);
    expect(changes[1][Record.VALUES_KEY]["name"]).toBe("name2_m");

    // UNMODIFIED
    // Records with this state are not included!

    // DELETED
    expect(changes[2][Record.STATE_KEY] as RecordState).toBe(RecordState.DELETED);
    expect(changes[2][Record.VALUES_KEY]["code"]).toBe("code4");
    expect(changes[2][Record.VALUES_KEY]["name"]).toBe(undefined);
}

function testModel_getChangesForSave() {
    let m = new TestModel1();
    let r1 = m.pushNewRecord("code1", "name1", 1);
    let r2 = m.loadRecord("code2", "name2", 2);
    r2.setValue("name", "name2_m");
    let r3 = m.loadRecord("code3", "name3", 3);
    let r4 = m.loadRecord("code4", "name4", 4);
    r4.delete();
    let changes = m.getChangesForSave();

    // ADDED
    expect(changes[0][Record.STATE_KEY] as RecordState).toBe(RecordState.ADDED);
    expect(changes[0][Record.VALUES_KEY]["name"]).toBe(undefined);
    expect(Object.keys(changes[0][Record.VALUES_KEY]).length).toBe(m.fields.length - 1);
    
    // MODIFIED
    expect(changes[1][Record.STATE_KEY] as RecordState).toBe(RecordState.MODIFIED);
    expect(changes[1][Record.VALUES_KEY]["name"]).toBe(undefined);

    // UNMODIFIED
    // Records with this state are not included!

    // DELETED
    expect(changes[2][Record.STATE_KEY] as RecordState).toBe(RecordState.DELETED);
    expect(changes[2][Record.VALUES_KEY]["code"]).toBe("code4");
    expect(changes[2][Record.VALUES_KEY]["name"]).toBe(undefined);
}

function testModel_merge() {
    // Target model should have ALL the fields of source model.

    let tm = new TestModel1();
    let r1 = tm.pushNewRecord("code1", "name1", 1);
    let r2 = tm.loadRecord("code2", "name2", 2);
    r2.setValue("name", "name2_m");
    let r3 = tm.loadRecord("code3", "name3", 3);
    let r4 = tm.loadRecord("code4", "name4", 4);
    r4.delete();

    let cm = new TestModel1(); // Target model has all the fields of source model.
    let nr1 = cm.pushNewRecord("code5", "name5", 5); // ADDED
    let nr2 = cm.loadRecord("code6", "name6", 6); // MODIFIED
    nr2.setValue("name", "name6_m");
    let nr3 = cm.loadRecord("code7", "name7", 7); // UNMODIFIED
    let nr4 = cm.loadRecord("code8", "name8", 8); // DELETED
    nr4.delete();
    expect(cm.records[3].state).toBe(RecordState.DELETED);


    expect(tm.records.length).toBe(4);
    tm.merge(cm);
    expect(tm.records.length).toBe(8);
    expect(tm.records[4].state).toBe(RecordState.ADDED);
    expect(tm.records[4].getValue("code")).toBe("code5");

    expect(tm.records[5].state).toBe(RecordState.MODIFIED);
    expect(tm.records[5].getValue("code")).toBe("code6");

    expect(tm.records[6].state).toBe(RecordState.UNMODIFIED);
    expect(tm.records[6].getValue("code")).toBe("code7");

    expect(tm.records[7].state).toBe(RecordState.DELETED);
    expect(tm.records[7].getValue("code", FieldValueVersion.ORIGINAL)).toBe("code8");

    let tm2 = new TestModel2(); // Target model doesnt have all the fields of source model.
    let nur1 = tm2.pushNewRecord("code9", "name9", 9); // ADDED


    expect(() => tm.merge(tm2)).toThrow(MergeModelError);

    let tm3 = new TestModel3(); // Target model has all the fields of source model PLUS one.
    let t3r1 = tm2.pushNewRecord("code13", "name9", 9); // ADDED
    let t3r2 = tm2.loadRecord("code14", "name10", 10); // MODIFIED
    t3r2.setValue("name", "name14_m");
    let t3r3 = tm2.loadRecord("code15", "name11", 11); // UNMODIFIED
    let t3r4 = tm2.loadRecord("code16", "name12", 12); // DELETED
    t3r4.delete();
    tm.merge(tm3);

    // Merge records
    let tm4 = new TestModel1();
    tm.acceptChanges();
    expect(tm.records.findByPrimaryKey("code1")?.getValue("name")).toBe("name1");
    tm4.loadRecord("code1", "name1_merged", 4);
    tm.merge(tm4);
    expect(tm.records.findByPrimaryKey("code1")?.getValue("name")).toBe("name1_merged");
}

function testModel_acceptChanges() {
    // Target model should have ALL the fields of source model.

    let tm = new TestModel1();
    let r1 = tm.loadRecord("code1", "name1", 1);
    let r2 = tm.loadRecord("code2", "name2", 2);
    let r3 = tm.loadRecord("code3", "name3", 3);
    let r4 = tm.loadRecord("code4", "name4", 4);


    r1.delete();
    r2.delete();
    r3.delete();
    r4.delete();

    tm.acceptChanges();

    expect(tm.records.length).toBe(0);
}

function testModel_valueChangingEvent() {
    let tm = new TestModel4();
    let r1 = tm.pushNewRecord("code1", "name1", 1);
    expect(r1.getValue("code")).toBe("code1_changing");
}

function testModel_valueChangedEvent() {
    let tm = new TestModel4();
    let r1 = tm.loadRecord("code1", "name1", 1);
    r1.setValue("code", "code1_changed");
    expect(r1.getValue("name")).toBe("name_changed");
}

function testModel_recordDeletingEvent() {
    let tm = new TestModel4();
    let r1 = tm.loadRecord("code1", "name1", 1);
    r1.delete();
    expect(r1.state).toBe(RecordState.UNMODIFIED);
}

function testModel_recordDeletedEvent() {
    let tm = new TestModel4();
    let r1 = tm.loadRecord("code1_throw", "name1", 1);
    expect(() => {r1.delete()}).toThrow(new Error("DELETED"));
}