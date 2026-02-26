import { ClosingCharNotFoundError } from "../utils/errors";
import { FilterOperator } from "../filterEvaluator/filterNode";
import { FilterParser } from "../filterEvaluator/filterParser";

describe("Testing model filter parser", () => {
    test("FilterParser : code = 'code'", testFilterParse1);
    test("FilterParser : code = 'code' and name = 'name'", testFilterParse2);
    test("FilterParser : (code = 'code' and name = 'name')", testFilterParse3);
    test("FilterParser : code = 'code with space'", testFilterParse4);
    test("FilterParser : (code = 'code with space' and name = 'name with space')", testFilterParse5);
    test("FilterParser : ((isAdmin = (code = 'code')) and (side = 'side')) or (total = 'total')", testFilterParse6);
    test("FilterParser : (isAdmin = (code = 'code')) and (side = 'side') or (total = 'total')", testFilterParse7);
    test("FilterParser : code IN ('code', 'name')", testFilterParse8);
    test("FilterParser : Not(code = 'code')", testFilterParse9);
    test("FilterParser : (code = 'code'", testFilterParse10);
    test("FilterParser : code = 'code", testFilterParse11);
    test("FilterParser : code = 'code = CODE'", testFilterParse12);
})

function testFilterParse1() {
    let fp = FilterParser.parse("code = 'code'");
    expect(fp.leftFilterExp).toBe("code");
    expect(fp.filterOperator).toBe(FilterOperator.Equal);
    expect(fp.rightFilterExp).toBe("'code'");
}

function testFilterParse2() {
    let fp = FilterParser.parse("code = 'code' and name = 'name'");
    expect(fp.leftFilterExp).toBe("code = 'code'");
    expect(fp.filterOperator).toBe(FilterOperator.AND);
    expect(fp.rightFilterExp).toBe("name = 'name'");
}

function testFilterParse3() {
    let fp = FilterParser.parse("(code = 'code' and name = 'name')");
    expect(fp.leftFilterExp).toBe("code = 'code'");
    expect(fp.filterOperator).toBe(FilterOperator.AND);
    expect(fp.rightFilterExp).toBe("name = 'name'");
}

function testFilterParse4() {
    let fp = FilterParser.parse("(code = 'code with space')");
    expect(fp.leftFilterExp).toBe("code");
    expect(fp.filterOperator).toBe(FilterOperator.Equal);
    expect(fp.rightFilterExp).toBe("'code with space'");
}

function testFilterParse5() {
    let fp = FilterParser.parse("(code = 'code with space' and name = 'name with space')");
    expect(fp.leftFilterExp).toBe("code = 'code with space'");
    expect(fp.filterOperator).toBe(FilterOperator.AND);
    expect(fp.rightFilterExp).toBe("name = 'name with space'");
}

function testFilterParse6() {
    let fp = FilterParser.parse("((isAdmin = (code = 'code')) and (side = 'side')) or (total = 'total')");
    expect(fp.leftFilterExp).toBe("(isAdmin = (code = 'code')) and (side = 'side')");
    expect(fp.filterOperator).toBe(FilterOperator.OR);
    expect(fp.rightFilterExp).toBe("(total = 'total')");
}

function testFilterParse7() {
    let fp = FilterParser.parse("(isAdmin = (code = 'code')) and (side = 'side') or (total = 'total')");
    expect(fp.leftFilterExp).toBe("isAdmin = (code = 'code')");
    expect(fp.filterOperator).toBe(FilterOperator.AND);
    expect(fp.rightFilterExp).toBe("(side = 'side') or (total = 'total')");
}

function testFilterParse8() {
    let fp = FilterParser.parse("code IN ('code', 'name')");
    expect(fp.leftFilterExp).toBe("code");
    expect(fp.filterOperator).toBe(FilterOperator.IN);
    expect(fp.rightFilterExp).toBe("('code', 'name')");
}

function testFilterParse9() {
    let fp = FilterParser.parse("Not(code = 'code')");
    expect(fp.filterOperator).toBe(FilterOperator.NOT);
    expect(fp.rightFilterExp).toBe("code = 'code'");
}

function testFilterParse10() {
    expect(() => FilterParser.parse("(code = 'code'")).toThrow(ClosingCharNotFoundError)
}

function testFilterParse11() {
    expect(() => FilterParser.parse("code = 'code")).toThrow(ClosingCharNotFoundError)
}

function testFilterParse12() {
    let fp = FilterParser.parse("code = 'code = CODE'");
    expect(fp.leftFilterExp).toBe("code");
    expect(fp.filterOperator).toBe(FilterOperator.Equal);
    expect(fp.rightFilterExp).toBe("'code = CODE'");
}