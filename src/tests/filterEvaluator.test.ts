import { Field } from "../field";
import { Model } from "../model";


class CountryModel extends Model {
    private _codeField: Field
    private _nameField : Field
    private _totalVotes : Field

    constructor() {
        super("Country");
    }

    override initModel(): void {
        this._codeField = this.pushNewField("code", String, false, true);
        this._codeField.nonStored = true;
        this._nameField = this.pushNewField("name", String, false, false);
        this._totalVotes = this.pushNewField("totalVotes", Number, false, false);
    }

    get codeField() {
        return this._codeField;
    }

    get nameField() {
        return this._nameField;
    }

}

let model = new CountryModel();
model.pushNewRecord("code1", "name1", 1);
model.pushNewRecord("code2", "name2", 2);

describe("Testing model filter selector",() => {
    test("FilterSelector : totalVotes = 2", testFilterSelect1);
    test("FilterSelector : code = 'code1'", testFilterSelect2);
    test("FilterSelector : code IN ('code1', 'code2')", testFilterSelect3);
    test("FilterSelector :  NOT(code = 'code1')", testFilterSelect4);
})

function testFilterSelect1() {
    expect(model.select("totalVotes = 2")[0].getValue("code")).toBe("code2");
}

function testFilterSelect2() {
    expect(model.select("code = 'code1'")[0].getValue("code")).not.toBe("code2");
}

function testFilterSelect3() {
    let selectedRecords = model.select("code IN ('code1', 'code2')");
    expect(selectedRecords[0].getValue("code")).toBe("code1");
    expect(selectedRecords[1].getValue("code")).toBe("code2");
}

function testFilterSelect4() {
    let selectedRecords = model.select("NOT (code = 'code1')");
    expect(selectedRecords[0].getValue("code")).toBe("code2");
}