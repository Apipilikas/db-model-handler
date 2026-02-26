import { Field } from "../field";
import { FieldValueVersion } from "../fieldValue";
import { Model } from "../model";
import { Record, RecordState } from "../record";
import { Schema } from "../schema";
import { StringValidator } from "../utils/dataTypeValidator";
import { AlreadyOnChangeModeError, ForeignFieldConstraintError, ForeignFieldReferenceError, NotOnChangeModeError } from "../utils/errors";

class TestModel extends Model {
    private _codeField : Field
    private _nameField : Field
    private _totalVotes : Field

    constructor() {
        super("Test");
    }

    override initModel(): void {
        this._codeField = this.pushNewField("code", String, false, true);
        this._nameField = this.pushNewField("name", String, false, false);
        this._totalVotes = this.pushNewField("totalVotes", Number, false, false);
        this._totalVotes.nonStored = true;
    }

    get codeField() {
        return this._codeField;
    }

    get nameField() {
        return this._nameField;
    }

    get totalVotes() {
        return this._totalVotes;
    }
}

class PolicyModel extends Model {
    idField : Field
    nameField : Field

    constructor() {
        super("Policy");

    }

    override initModel(): void {
        this.idField = this.pushNewField("ID", String, false, true);
        this.nameField = this.pushNewField("Name", String, false, false);
    }
}

class PolicyEntryModel extends Model {
    policyIDField : Field
    descField : Field

    constructor() {
        super("Policy Entry");

    }

    override initModel(): void {
        this.policyIDField = this.pushNewField("PolicyID", String, false, true);
        this.descField = this.pushNewField("Desc", String, false, false);
    }
}

class JudgeModel extends Model {
    policyIDField : Field
    codeField : Field

    constructor() {
        super("Judge");

    }

    override initModel(): void {
        this.codeField = this.pushNewField("Code", String, false, true);
        this.policyIDField = this.pushNewField("PolicyID", String, false, false);
    }
}

class PolicySchema extends Schema {
    policy : PolicyModel
    policyEntry : PolicyEntryModel
    judge : JudgeModel

    constructor() {
        super("Policy Schema");
    }

    override initSchema(): void {
        this.policy = new PolicyModel();
        this.policyEntry = new PolicyEntryModel();
        this.judge = new JudgeModel();
        this.models.push(this.policy);
        this.models.push(this.policyEntry);
        this.models.push(this.judge);
        this.pushNewRelation("FK_Policy_PolicyEntry", this.policy.idField, this.policyEntry.policyIDField, true, true);
        this.pushNewRelation("FK_Policy_Judge", this.policy.idField, this.judge.policyIDField, false, false);
    }
}

describe("Testing Record", () => {
    test("Record : new", testRecord_new);
    test("Record : loadData", testRecord_loadData);
    test("Record : copy", testRecord_copy)
    test("Record : getCorrectValuesOrderList", testRecord_getCorrectValuesOrderList);
    test("Record State : DETACHED", testDetachedRecord);
    test("Record State : ADDED", testAddedRecord);
    test("Record State : MODIFIED", testModifiedRecord);
    test("Record State : UNMODIFIED", testUnmodifiedRecord);
    test("Record State : DELETED", testDeletedRecord);
    test("New Record : acceptChanges", testNewRecord_acceptChanges);
    test("New Record : rejectChanges", testNewRecord_rejectChanges);
    test("Load Record : acceptChanges", testLoadedRecord_acceptChanges);
    test("Load Record : rejectChanges", testLoadedRecord_rejectChanges);
    test("Record : serialization", test_serialize);
    test("Record : getChanges", testRecord_getChanges);
    test("Record : getChangesForSave", testRecord_getChangesForSave);
    test("Record : delete", testRecord_delete);
    test("Record : serializeForDisplay", testRecord_serializeForDisplay);
    test("Record : checkForeignContraints", testRecord_checkForeignContraints);
    test("Record : getCascadeChanges", testRecord_getCacadeChanges);
    test("Record : findByPrimaryKeys", testRecord_findByPrimaryKeys);
    test("Record : merge", testRecord_merge);
    test("Record : mergeBySerialization", testRecord_mergeBySerialization);
    test("Record : changesTracker", testRecord_changesTracker);
})

function testRecord_new() {
    let m = new TestModel();
    let r = Record.new(m, "code", "name", 10);
    expect(r.state).toBe(RecordState.DETACHED);
    expect(r.getValue("code", FieldValueVersion.ORIGINAL)).toBe(StringValidator.empty);
    expect(r.getValue("code", FieldValueVersion.CURRENT)).toBe("code");
    expect(r.getValue("name", FieldValueVersion.ORIGINAL)).toBe(StringValidator.empty);
    expect(r.getValue("name", FieldValueVersion.CURRENT)).toBe("name");
    expect(r.getValue("totalVotes", FieldValueVersion.ORIGINAL)).toBe(0);
    expect(r.getValue("totalVotes", FieldValueVersion.CURRENT)).toBe(10);
}

function testRecord_loadData() {
    let m = new TestModel();
    let r = Record.loadData(m, "code", "name", 10);
    expect(r.state).toBe(RecordState.DETACHED);
    expect(r.getValue("code", FieldValueVersion.ORIGINAL)).toBe("code");
    expect(r.getValue("code", FieldValueVersion.CURRENT)).toBe("code");
    expect(r.getValue("name", FieldValueVersion.ORIGINAL)).toBe("name");
    expect(r.getValue("name", FieldValueVersion.CURRENT)).toBe("name");
    expect(r.getValue("totalVotes", FieldValueVersion.ORIGINAL)).toBe(10);
    expect(r.getValue("totalVotes", FieldValueVersion.CURRENT)).toBe(10);
}

function testRecord_copy() {
    let m = new TestModel();
    let r = m.pushNewRecord("code", "name", 10);
    let cr = Record.copy(m, r);

    // ADDED
    expect(r.state).toBe(RecordState.ADDED);
    expect(cr.state).toBe(RecordState.ADDED);
    expect(r.getValue("code", FieldValueVersion.ORIGINAL)).toBe(StringValidator.empty);
    expect(r.getValue("code", FieldValueVersion.CURRENT)).toBe("code");
    expect(r.getValue("name", FieldValueVersion.ORIGINAL)).toBe(StringValidator.empty);
    expect(r.getValue("name", FieldValueVersion.CURRENT)).toBe("name");
    expect(r.getValue("totalVotes", FieldValueVersion.ORIGINAL)).toBe(0);
    expect(r.getValue("totalVotes", FieldValueVersion.CURRENT)).toBe(10);

    expect(cr.getValue("code", FieldValueVersion.ORIGINAL)).toBe(StringValidator.empty);
    expect(cr.getValue("code", FieldValueVersion.CURRENT)).toBe("code");
    expect(cr.getValue("name", FieldValueVersion.ORIGINAL)).toBe(StringValidator.empty);
    expect(cr.getValue("name", FieldValueVersion.CURRENT)).toBe("name");
    expect(cr.getValue("totalVotes", FieldValueVersion.ORIGINAL)).toBe(0);
    expect(cr.getValue("totalVotes", FieldValueVersion.CURRENT)).toBe(10);

    // DELETED
    let dr = m.loadRecord("code_d", "name_d", 12);
    dr.delete();
    let cdr = Record.copy(m, dr);
    expect(dr.state).toBe(RecordState.DELETED);
    expect(cdr.state).toBe(RecordState.DELETED);
}

function testRecord_getCorrectValuesOrderList() {
    let m = new TestModel();
    let properties = "{\"name\":\"name_test\",\"code\":\"code_test\",\"totalVotes\":0}";
    expect(Record.getCorrectValuesOrderList(m, properties).toString()).toBe(["code_test", "name_test", 0].toString())
}

function testAddedRecord() {
    let m = new TestModel();
    let r1 = Record.new(m, "code_added", "name_added");
    expect(r1.state).toBe(RecordState.DETACHED);
    r1.setValue("name", "name_added2");
    expect(r1.getValue("name")).toBe("name_added2");
    expect(r1.hasChanges()).toBeTruthy();
    expect(() => r1.acceptChanges()).toThrow("Record is DETACHED. Cannot accept changes.");

    m.records.push(r1);
    expect(r1.state).toBe(RecordState.ADDED);
    r1.rejectChanges();
    expect(r1.state).toBe(RecordState.DETACHED);
}

function testModifiedRecord() {
    let m = new TestModel();
    let r1 = Record.loadData(m, "code_mod", "name_mod");
    expect(r1.state).toBe(RecordState.DETACHED);
    r1.setValue("name", "name_mod2");
    m.records.push(r1);
    expect(r1.state).toBe(RecordState.MODIFIED);
    r1.rejectChanges();
    expect(r1.state).toBe(RecordState.UNMODIFIED);
    r1.setValue("name", "name_mod2");
    r1.acceptChanges();
    expect(r1.state).toBe(RecordState.UNMODIFIED);
}

function testUnmodifiedRecord() {
    let m = new TestModel();
    let r1 = Record.loadData(m, "code_unmod", "name_mod");
    expect(r1.state).toBe(RecordState.DETACHED);
    m.records.push(r1);
    expect(r1.state).toBe(RecordState.UNMODIFIED);
    r1.rejectChanges();
    expect(r1.state).toBe(RecordState.UNMODIFIED);
    r1.acceptChanges();
    expect(r1.state).toBe(RecordState.UNMODIFIED);
}

function testDeletedRecord() {
    let m = new TestModel();
    // ADDED -> delete -> DETACHED -> removed from array
    let r1 = m.pushNewRecord("code5", "name5");
    expect(r1.state).toBe(RecordState.ADDED);
    let l = m.records.length; 
    expect(m.records.length).toBe(l);
    r1.delete();
    expect(m.records.length).toBe(l - 1);
    expect(r1.state).toBe(RecordState.DETACHED);

    // MODIFIED -> delete -> DELETED -> NOT removed from array
    let r2 = m.loadRecord("code5", "name5");
    expect(r2.state).toBe(RecordState.UNMODIFIED);
    expect(m.records.length).toBe(l);
    r2.delete();
    expect(r2.state).toBe(RecordState.DELETED);
    expect(m.records.length).toBe(l);
    expect(() => r2.getValue("code", FieldValueVersion.CURRENT)).toThrow("Cannot get CURRENT value on DELETED record.");
    expect(r2.getValue("code", FieldValueVersion.ORIGINAL)).toBe("code5");
    expect(() => r2.delete()).toThrow("Record is already DELETED.");
    expect(r2.hasChanges()).toBeTruthy();
    r2.acceptChanges();
    expect(r2.state).toBe(RecordState.DETACHED);
}

function testDetachedRecord() {
    let m = new TestModel();
    let r1 = Record.new(m, "code5", "name5");
    expect(r1.state).toBe(RecordState.DETACHED);
    m.records.push(r1);
    expect(r1.state).toBe(RecordState.ADDED);
    r1.rejectChanges();
    expect(r1.state).toBe(RecordState.DETACHED);

    let r2 = Record.loadData(m, "code6", "name6");
    expect(r2.state).toBe(RecordState.DETACHED);
    m.records.push(r2);
    expect(r2.state).toBe(RecordState.UNMODIFIED);
    expect(r2.hasChanges()).toBeFalsy();

    let r3 = Record.loadData(m, "code7", "name7");
    r3.loadData("code8", "name8");
    expect(r3.state).toBe(RecordState.DETACHED);
    m.records.push(r3);
    expect(r3.state).toBe(RecordState.MODIFIED);
    expect(r3.hasChanges()).toBeTruthy();
}

function testNewRecord_acceptChanges() {
    let m = new TestModel();
    let r1 = m.pushNewRecord("code1");
    expect(r1.state).toBe(RecordState.ADDED);

    expect(m.hasChanges()).toBeTruthy();

    expect(r1.hasChanges()).toBeTruthy();
    r1.acceptChanges();
    expect(r1.hasChanges()).toBeFalsy();
    expect(r1.state).toBe(RecordState.UNMODIFIED);
    expect(r1.getValue("code", FieldValueVersion.CURRENT)).toBe("code1");
    expect(r1.getValue("code", FieldValueVersion.ORIGINAL)).toBe("code1");

    expect(m.hasChanges()).toBeFalsy();
}

function testNewRecord_rejectChanges() {
    let m = new TestModel();
    let r2 = m.pushNewRecord("code2");

    expect(m.hasChanges()).toBeTruthy();
    
    expect(r2.state).toBe(RecordState.ADDED);
    expect(r2.hasChanges()).toBeTruthy();
    r2.rejectChanges();
    expect(r2.hasChanges()).toBeTruthy();
    expect(r2.state).toBe(RecordState.DETACHED);
    expect(r2.getValue("code", FieldValueVersion.CURRENT)).toBe("code2");
    expect(r2.getValue("code", FieldValueVersion.ORIGINAL)).toBe(StringValidator.empty);

    expect(m.hasChanges()).toBeFalsy();
}

function testLoadedRecord_acceptChanges() {
    let m = new TestModel();
    let r1 = m.loadRecord("code3");
    expect(r1.state).toBe(RecordState.UNMODIFIED);

    // Record acceptChanges
    expect(r1.hasChanges()).toBeFalsy();
    
    r1.setValue("name", "name1");

    expect(r1.hasChanges()).toBeTruthy();
    expect(r1.getValue("name", FieldValueVersion.CURRENT)).toBe("name1");
    expect(r1.getValue("name", FieldValueVersion.ORIGINAL)).toBe(StringValidator.empty);
    r1.acceptChanges();
}

function testLoadedRecord_rejectChanges() {
    let m = new TestModel();
    let r2 = m.loadRecord("code4", "name2");

    expect(r2.hasChanges()).toBeFalsy();

    r2.setValue("name", "name3")
    expect(r2.state).toBe(RecordState.MODIFIED);
    expect(r2.getValue("name", FieldValueVersion.CURRENT)).toBe("name3");
    expect(r2.getValue("name", FieldValueVersion.ORIGINAL)).toBe("name2");

    r2.rejectChanges();
    expect(r2.state).toBe(RecordState.UNMODIFIED);
    expect(r2.getValue("name", FieldValueVersion.CURRENT)).toBe("name2");
    expect(r2.getValue("name", FieldValueVersion.ORIGINAL)).toBe("name2");
    
    expect(r2.hasChanges()).toBeFalsy();
}

function test_serialize() {
    let m = new TestModel();
    // ADDED
    let r1 =  m.pushNewRecord("code_s", "name", 0);
    let serializedObj = r1.serialize();
    expect(serializedObj[Record.STATE_KEY] as RecordState).toBe(RecordState.ADDED);
    expect(serializedObj[Record.CURRENT_VALUES_KEY]["name"]).toBe("name");
    r1.rejectChanges();

    // UNMODIFIED
    let r2 = m.loadRecord("code_s", "name_s", 4);
    serializedObj = r2.serialize();
    expect(serializedObj[Record.STATE_KEY] as RecordState).toBe(RecordState.UNMODIFIED);
    expect(serializedObj[Record.ORIGINAL_VALUES_KEY]["name"]).toBe("name_s");

    // MODIFIED
    r2.setValue("name", "name_s1");
    serializedObj = r2.serialize();
    expect(serializedObj[Record.STATE_KEY] as RecordState).toBe(RecordState.MODIFIED);
    expect(serializedObj[Record.ORIGINAL_VALUES_KEY]["name"]).toBe("name_s");
    expect(serializedObj[Record.CURRENT_VALUES_KEY]["name"]).toBe("name_s1");

    // DELETED
    r2.delete();
    serializedObj = r2.serialize();
    expect(serializedObj[Record.STATE_KEY] as RecordState).toBe(RecordState.DELETED);
    expect(serializedObj[Record.ORIGINAL_VALUES_KEY]["name"]).toBe("name_s");
    expect(serializedObj[Record.CURRENT_VALUES_KEY]["name"]).toBe(undefined);

    // DETACHED
    r2.acceptChanges();
    serializedObj = r2.serialize();
    expect(serializedObj[Record.STATE_KEY] as RecordState).toBe(RecordState.DETACHED);
    expect(serializedObj[Record.ORIGINAL_VALUES_KEY]["name"]).toBe("name_s");
    expect(serializedObj[Record.CURRENT_VALUES_KEY]["name"]).toBe("name_s1");
}

function testRecord_getChanges() {
    let m = new TestModel();
    // ADDED
    let r1 = m.pushNewRecord("code_a", "name_a");
    expect(r1.state).toBe(RecordState.ADDED);
    let changes = r1.getChanges();
    expect(Object.keys(changes).length).toBe(m.fields.length);

    // UNMODIFIED
    let r2 = m.loadRecord("code_um", "name_um");
    expect(r2.state).toBe(RecordState.UNMODIFIED);
    changes = r2.getChanges();
    expect(Object.keys(changes).length).toBe(0);

    // DELETED
    r2.delete();
    changes = r2.getChanges();
    expect(changes[m.getPrimaryKeyName()[0]]).toBe("code_um");
    r2.acceptChanges();

    // MODIFIED
    let r3 = m.loadRecord("code_um", "name_um");
    r3.setValue("name", "name_m");
    expect(r3.hasChanges()).toBeTruthy();
    changes = r3.getChanges();
    // Expect to have primary key + changes
    expect(Object.keys(changes).length).toBe(2);
    expect(changes[m.getPrimaryKeyName()[0]]).toBe("code_um");
    expect(changes[m.nameField.fieldName]).toBe("name_m");

    // DETACHED
    r1.delete();
    expect(r1.state).toBe(RecordState.DETACHED);
    changes = r1.getChanges();
    expect(Object.keys(changes).length).toBe(0);
}

function testRecord_getChangesForSave() {
    let m = new TestModel();
    // ADDED
    let r1 = m.pushNewRecord("code_a", "name_a");
    expect(r1.state).toBe(RecordState.ADDED);
    let changes = r1.getChangesForSave();
    expect(Object.keys(changes).length).toBe(m.fields.length - 1);

    // UNMODIFIED
    let r2 = m.loadRecord("code_um", "name_um");
    expect(r2.state).toBe(RecordState.UNMODIFIED);
    changes = r2.getChangesForSave();
    expect(Object.keys(changes).length).toBe(0);

    // DELETED
    r2.delete();
    changes = r2.getChangesForSave();
    expect(changes[m.getPrimaryKeyName()[0]]).toBe("code_um");
    r2.acceptChanges();

    // MODIFIED
    let r3 = m.loadRecord("code_um", "name_um", 6);
    r3.setValue("name", "name_m");
    r3.setValue("totalVotes", 10);
    expect(r3.hasChanges()).toBeTruthy();
    changes = r3.getChangesForSave();
    // Expect to have primary key + changes
    expect(Object.keys(changes).length).toBe(2);
    expect(changes[m.getPrimaryKeyName()[0]]).toBe("code_um");
    expect(changes[m.nameField.fieldName]).toBe("name_m");

    // DETACHED
    r1.delete();
    expect(r1.state).toBe(RecordState.DETACHED);
    changes = r1.getChangesForSave();
    expect(Object.keys(changes).length).toBe(0);
}

function testRecord_delete() {
    let sc : PolicySchema = new PolicySchema();
    sc.policy.loadRecord("pid", "name1");
    sc.policyEntry.loadRecord("pid", "desc1");

    // Cascade delete
    sc.policy.records[0].delete();
    expect(sc.policy.records[0].state).toBe(RecordState.DELETED);
    expect(sc.policyEntry.records[0].state).toBe(RecordState.DELETED);

    sc.rejectChanges();

    // Cascade delete - check foreign constraints
    sc.judge.loadRecord("code1", "pid");
    expect(() => {sc.policy.records[0].delete()}).toThrow(ForeignFieldReferenceError);
}

function testRecord_serializeForDisplay() {
    let m = new TestModel();
    // ADDED
    let r1 =  m.pushNewRecord("code_s", "name", 0);
    let serializedObj = r1.serializeForDisplay();
    expect(serializedObj["name"]).toBe("name");
    r1.rejectChanges();

    // UNMODIFIED
    let r2 = m.loadRecord("code_s", "name_s", 4);
    serializedObj = r2.serializeForDisplay();
    expect(serializedObj["name"]).toBe("name_s");

    // MODIFIED
    r2.setValue("name", "name_s1");
    serializedObj = r2.serializeForDisplay();
    expect(serializedObj["name"]).toBe("name_s1");

    // DELETED
    r2.delete();
    serializedObj = r2.serializeForDisplay();
    expect(serializedObj["name"]).toBe("name_s");

    // DETACHED
    r2.acceptChanges();
    serializedObj = r2.serializeForDisplay();
    expect(serializedObj["name"]).toBe("name_s1");
}

function testRecord_checkForeignContraints() {
    let sc : PolicySchema = new PolicySchema();
    sc.policy.loadRecord("pid", "name1");
    expect(() => sc.policyEntry.loadRecord("pid1", "desc1")).toThrow(ForeignFieldConstraintError);
    sc.policyEntry.loadRecord("pid", "desc1")
    sc.judge.loadRecord("code1", "pid")
    expect(sc.policyEntry.records[0].getValue("PolicyID")).toBe(sc.policy.records[0].getValue("ID"));
    expect(sc.judge.records[0].getValue("PolicyID")).toBe(sc.policy.records[0].getValue("ID"));
    sc.policy.records[0].setValue("ID", "pid_new")
    expect(sc.policyEntry.records[0].getValue("PolicyID")).toBe(sc.policy.records[0].getValue("ID"));
    expect(sc.judge.records[0].getValue("PolicyID")).toBe(sc.policy.records[0].getValue("ID"));
}

function testRecord_getCacadeChanges() {
    let sc : PolicySchema = new PolicySchema();
    sc.policy.loadRecord("pid", "name1");
    sc.policyEntry.loadRecord("pid", "desc1")
    sc.policy.records[0].setValue("ID", "pid_new")
    // let changes = sc.policy.records[0].getCascadeChanges();
    // expect(changes["ID"][Record.CHILD_VALUES_KEY][0][Record.CHILD_MODEL_NAME_KEY]).toBe(sc.policyEntry.modelName);
    // expect(changes["ID"][Record.CHILD_VALUES_KEY][0][Record.CHILD_FIELD_NAME_KEY]).toBe("PolicyID");
}

function testRecord_findByPrimaryKeys() {
    let m = new TestModel();
    m.loadRecord("code_um", "name_um");

    expect(m.records.findByPrimaryKey("code_um")?.getValue("code")).toBe(m.records[0].getValue("code"));
}

function testRecord_merge() {
    let m = new TestModel();
    let mm = new TestModel();

    // sourceRecord     recordToBeMerged
    // ---------------------------------
    // ADDED            ADDED           //  Both states should be added
    let r1 =  m.pushNewRecord("code_s", "name", 0);
    let mr1 = mm.pushNewRecord("code_s", "name_merged", 2);
    r1.merge(mr1);
    expect(r1.getValue("name")).toBe("name_merged");
    expect(r1.getValue("totalVotes")).toBe(2);

    // ADDED            UNMODIFIED      // DO NOTHING
    mr1.setValue("name", "name_unmodified");
    mr1.acceptChanges();
    r1.merge(mr1);
    expect(r1.getValue("name")).not.toBe("name_unmodified");
    mr1.delete();
    mr1.acceptChanges();

    // UNMODIFIED       ADDED       // DO NOTHING
    r1.acceptChanges();
    mr1 = mm.pushNewRecord("code_s", "added_name", 2);
    r1.merge(mr1);
    expect(r1.getValue("name")).not.toBe("added_name");
    mr1.rejectChanges();

    // UNMODIFIED       MODIFIED    // Merge changes
    m.records.clear();
    r1 =  m.loadRecord("code_s", "name", 0);
    let mr2 =  mm.loadRecord("code_s", "name", 0);
    mr2.setValue("name", "name_modified");
    r1.merge(mr2);
    expect(r1.getValue("name")).toBe("name_modified");
    r1.rejectChanges();

    // UNMODIFIED       DELETE      // Turn source record into deleted
    mr2.delete();
    r1.merge(mr2);
    expect(r1.state).toBe(RecordState.DELETED);
    // DELETE           DELETE      // DO NOTHING
    r1.merge(mr2);
    expect(r1.state).toBe(RecordState.DELETED);
    // DELETE           MODIFIED    // DO NOTHING
    mr2.acceptChanges();
    let mr3 = mm.loadRecord("code_s", "name", 0);
    r1.merge(mr3);
    expect(r1.state).toBe(RecordState.DELETED);
}

function testRecord_mergeBySerialization() {
    let m = new TestModel();
    let r1 =  m.loadRecord("code_s", "name", 0);

    let obj = {
        code : "code_s",
        name : "name_modified"
    }

    r1.mergeBySerialization(obj);
    expect(r1.getValue("name")).toBe("name_modified");
    expect(r1.getValue("totalVotes")).toBe(0);

    let newObj = {
        name : "name_changed",
        totalVotes: 5,
        name2 : "name_modified"
    }

    expect(() => {r1.mergeBySerialization(newObj)}).toThrow();
    expect(r1.getValue("name")).toBe("name");
    expect(r1.getValue("totalVotes")).toBe(0);
}

function testRecord_changesTracker() {
    let m = new TestModel();
    let r1 =  m.loadRecord("code_s", "name", 0);

    r1.beginChanges()
    r1.setValue("code", "code_modified");
    expect(r1.getValue("code")).toBe("code_modified");
    expect(() => {r1.beginChanges()}).toThrow(AlreadyOnChangeModeError);
    r1.cancelChanges()
    expect(() => {r1.endChanges()}).toThrow(NotOnChangeModeError);
    expect(() => {r1.cancelChanges()}).toThrow(NotOnChangeModeError);
    expect(r1.getValue("code")).toBe("code_s");
}