"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterNode = exports.FilterOperatorUtils = exports.FilterOperator = exports.FilterNodeType = void 0;
var FilterNodeType;
(function (FilterNodeType) {
    FilterNodeType[FilterNodeType["NOTHING"] = 0] = "NOTHING";
    FilterNodeType[FilterNodeType["EXPRESSION"] = 1] = "EXPRESSION";
    FilterNodeType[FilterNodeType["FIELD"] = 2] = "FIELD";
    FilterNodeType[FilterNodeType["VALUE"] = 3] = "VALUE";
    FilterNodeType[FilterNodeType["VALUES"] = 4] = "VALUES";
})(FilterNodeType || (exports.FilterNodeType = FilterNodeType = {}));
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["NONE"] = "NONE";
    FilterOperator["NOT"] = "NOT";
    FilterOperator["Equal"] = "EQUAL";
    FilterOperator["NOTEqual"] = "NOTEQUAL";
    FilterOperator["AND"] = "AND";
    FilterOperator["OR"] = "OR";
    FilterOperator["Greater"] = "GREATER";
    FilterOperator["GreaterOREqual"] = "GREATEROREQUAL";
    FilterOperator["Less"] = "LESS";
    FilterOperator["LessOREqual"] = "LESSOREQUAL";
    FilterOperator["IN"] = "IN";
})(FilterOperator || (exports.FilterOperator = FilterOperator = {}));
class FilterOperatorUtils {
    static getFilterOperator(str) {
        let upperStr = str.toUpperCase();
        switch (upperStr) {
            case "NOT": return FilterOperator.NOT;
            case "==":
            case "=": return FilterOperator.Equal;
            case "!=":
            case "<>": return FilterOperator.NOTEqual;
            case "AND": return FilterOperator.AND;
            case "OR": return FilterOperator.OR;
            case ">": return FilterOperator.Greater;
            case ">=": return FilterOperator.GreaterOREqual;
            case "<": return FilterOperator.Less;
            case "<=": return FilterOperator.LessOREqual;
            case "IN": return FilterOperator.IN;
        }
        return FilterOperator.NONE;
    }
    static isFilterOperator(str, filterOperator) {
        return this.getFilterOperator(str) == filterOperator;
    }
}
exports.FilterOperatorUtils = FilterOperatorUtils;
class FilterNode {
    constructor(value, type) {
        this._value = "";
        this._type = FilterNodeType.NOTHING;
        this._leftNode = null;
        this._operator = FilterOperator.NONE;
        this._rightNode = null;
        this._value = value;
        this._type = type;
    }
    get value() {
        return this._value;
    }
    get type() {
        return this._type;
    }
    get leftNode() {
        return this._leftNode;
    }
    set leftNode(value) {
        if (this._type != FilterNodeType.EXPRESSION)
            throw new Error("Node is set as a LEAF node");
        this._leftNode = value;
    }
    get operator() {
        return this._operator;
    }
    get rightNode() {
        return this._rightNode;
    }
    set rightNode(value) {
        if (this._type != FilterNodeType.EXPRESSION)
            throw new Error("Node is set as a LEAF node");
        this._rightNode = value;
    }
    static createExpressionNode(filter, operator) {
        let node = new FilterNode(filter, FilterNodeType.EXPRESSION);
        node._operator = operator;
        return node;
    }
    static createFieldNode(fieldName) {
        let node = new FilterNode(fieldName, FilterNodeType.FIELD);
        return node;
    }
    static createValueNode(value) {
        let node = new FilterNode(value, FilterNodeType.VALUE);
        return node;
    }
    static createValuesNode(seperatedValues) {
        let node = new FilterNode(seperatedValues, FilterNodeType.VALUES);
        return node;
    }
}
exports.FilterNode = FilterNode;
