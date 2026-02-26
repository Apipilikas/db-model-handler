import { Field } from "../field";
import { Model } from "../model";
import { Schema } from "../schema";

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
    countryIDField : Field

    constructor() {
        super("Policy Entry");

    }

    override initModel(): void {
        this.policyIDField = this.pushNewField("PolicyID", String, false, true);
        this.descField = this.pushNewField("Desc", String, false, false);
    }
}

class JudgeModel extends Model {
    IDField : Field
    policyIDField : Field

    constructor() {
        super("Judge");
    }

    override initModel(): void {
        this.IDField = this.pushNewField("ID", String, false, true);
        this.policyIDField = this.pushNewField("policyID", String, false, false);
        this.policyIDField.nullable = true;
        this.policyIDField.defaultValue = null;
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
        this.pushNewRelation("FK_Policy_PolicyEntry", this.policy.idField, this.policyEntry.policyIDField);
        this.pushNewRelation("FK_Policy_Judge", this.policy.idField, this.judge.policyIDField);
    }
}

// FK_Policy_PolicyEntry
// parent -> Policy -> add child relation
// child -> PolicyEntry -> add parent relation
// pe.getParent() -> policy // parentrelations
// p.getChild() -> policyEntry //childrelations

let sc : PolicySchema = new PolicySchema();
sc.policy.pushNewRecord("pid", "name1");
sc.policyEntry.pushNewRecord("pid", "desc1");

describe("Testing schema",() => {
    test("Parent record", testParentRecord);
    test("Child record", testChildRecord);
    test("Schema : getStructure", testSchema_getStructure);
    test("BUG", testSchema_pushNullValue);
});

function testParentRecord() {
    let pr = sc.policyEntry.records[0].getParentRecord("FK_Policy_PolicyEntry");
    expect(pr?.getValue("Name")).toBe("name1");
}

function testChildRecord() {
    let cr = sc.policy.records[0].getChildRecords("FK_Policy_PolicyEntry");
    if (cr == null || cr.length == 0) return;
    
    expect(cr[0].getValue("Desc")).toBe("desc1");
}

function testSchema_getStructure() {
    let obj = sc.serializeStructure();
    let s = Schema.deserializeStructure(obj);
    s.deserialize(sc.serialize());
    let r = s.relations[0];
    // expect(JSON.stringify(s.models[0]a.serializeForDisplay())).toBe(1);
}

function testSchema_pushNullValue() {
    let r = sc.judge.pushNewRecord("code");
    expect(r.getValue("policyID")).toBe(null);
}