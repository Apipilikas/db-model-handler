"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterEvaluator = void 0;
class FilterEvaluator {
    constructor(filter) {
        this.filterNodeRoot = null;
        this.filter = filter;
    }
    // (code = "code") and (side = "side")
    // A AND B
    // A -> code = "code" -> "a" == "code
    createTree() {
    }
    evaluate(record) {
        return true;
    }
}
exports.FilterEvaluator = FilterEvaluator;
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
})(FilterOperator || (FilterOperator = {}));
var LeafFilter;
(function (LeafFilter) {
    LeafFilter[LeafFilter["NONE"] = 0] = "NONE";
    LeafFilter[LeafFilter["LEFT"] = 2] = "LEFT";
    LeafFilter[LeafFilter["RIGHT"] = 8] = "RIGHT";
})(LeafFilter || (LeafFilter = {}));
var FilterType;
(function (FilterType) {
    FilterType[FilterType["NOTHING"] = 0] = "NOTHING";
    FilterType[FilterType["EXPRESSION"] = 1] = "EXPRESSION";
    FilterType[FilterType["FIELD"] = 2] = "FIELD";
    FilterType[FilterType["VALUE"] = 3] = "VALUE";
})(FilterType || (FilterType = {}));
// filter -> a and b
// 1 find splitter
// split values
// is lieaf node
// is value or field node
class FilterSplitter {
    constructor(filter, filterOperator = FilterOperator.NONE) {
        this._leftFilterExp = "";
        this._rightFilterExp = "";
        this._filter = filter;
        this._filterOperator = filterOperator == FilterOperator.NONE ? this.getFirstFilterOperator() : filterOperator;
    }
    static parse(filter, filterOperator) {
        let splitter = new FilterSplitter(filter, filterOperator);
        return splitter;
    }
    get leftFilterExp() {
        return this._leftFilterExp;
    }
    get rightFilterExp() {
        return this._rightFilterExp;
    }
    get filterOperator() {
        return this._filterOperator;
    }
    split() {
        let splittedValues = this._filter.split(this._filterOperator);
    }
    splitByOperator(filterOperator) {
        let splittedValues = this._filter.split(" ");
        if (splittedValues.length = 1) {
            // field or value
        }
        else {
            for (var value of splittedValues) {
            }
        }
    }
    isLeafOperator() {
        return this._filterOperator == FilterOperator.Equal ||
            this._filterOperator == FilterOperator.NOTEqual;
    }
    getFilterType() {
    }
    parse() {
        let splittedValues = this._filter.split(this._filterOperator);
        this._leftFilterExp = splittedValues[0];
        this._rightFilterExp = splittedValues[1];
    }
    getFirstFilterOperator() {
        let splittedValues = this._filter.toLowerCase().split(" ");
        for (var value of splittedValues) {
            switch (value) {
                case "and": return FilterOperator.AND;
                case "or": return FilterOperator.OR;
                case "=": return FilterOperator.Equal;
            }
        }
        return FilterOperator.NONE;
    }
}
class FilterNode {
    constructor(filter, type) {
        this._filter = "";
        this._type = FilterType.NOTHING;
        this._leftNode = null;
        this._operator = FilterOperator.NONE;
        this._rightNode = null;
        this._filter = filter;
        this._type = type;
    }
    get filter() {
        return this._filter;
    }
    get type() {
        return this._type;
    }
    get leftNode() {
        return this._leftNode;
    }
    set leftNode(value) {
        if (!this.isExpressionNode())
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
        if (!this.isExpressionNode())
            throw new Error("Node is set as a LEAF node");
        this._rightNode = value;
    }
    static createExpressionNode(filter, operator) {
        let node = new FilterNode(filter, FilterType.EXPRESSION);
        return node;
    }
    static createFieldNode(fieldName) {
        let node = new FilterNode(fieldName, FilterType.FIELD);
        return node;
    }
    static createValueNode(value) {
        let node = new FilterNode(value, FilterType.VALUE);
        return node;
    }
    isExpressionNode() {
        return this._type == FilterType.EXPRESSION;
    }
    isFieldNode() {
        return this._type == FilterType.FIELD;
    }
    isValueNode() {
        return this._type == FilterType.VALUE;
    }
}
class EqualFilterExpression {
}
class AndFilterExpression {
}
class OrFilterExpression {
}
class NotFilterExpression {
}
