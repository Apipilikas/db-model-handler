"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterSelector = void 0;
const filterEvaluator_1 = require("./filterEvaluator");
const filterNode_1 = require("./filterNode");
const filterParser_1 = require("./filterParser");
class FilterSelector {
    constructor(filter, model) {
        this._nodeRoot = null;
        this._filter = filter;
        this._model = model;
        this.createTree();
    }
    get filter() {
        return this._filter;
    }
    get nodeRoot() {
        return this._nodeRoot;
    }
    static getSelectedRecords(filter, model) {
        let selector = new FilterSelector(filter, model);
        return selector.getSelectedRecords();
    }
    // (code = "code") and (side = "side")
    // A AND B
    // A -> code = "code" -> "a" == "code
    // step A : isLeafNode? -> there is only one string seperated by space, there is no other string excluding the string in ''
    // step B : simplify parenthesis. Find opening and closing parenthesis. Add content to list. If not found, for every single string
    //          we read, we add it to the list. When an operator is found like AND OR, all the previous strings in list are concatanated into
    //          one string.
    // A)
    // (code = "code") and (side = "side")
    // B)
    // code = "code" and side = "side"
    // C)
    // (isAdmin = (code = "code")) and (side = "side")
    // D)
    // (isAdmin = (code = "code")) and (side = "side") or (total = "total")
    // E) - TRICKY PARENTHESIS
    // ((isAdmin = (code = "code")) and (side = "side")) or (total = "total")
    // F) NO PARENTHESIS
    // code = "code" and total = "total"
    // H) Not(code = 'code') -> code != 'code'
    // [true, not, code = 'code']
    // Not(code = 'code') and name = 'name'
    //[not(code='code'), and , name = 'name']
    // IN 
    // code IN ('code')
    // code IN ('code', 'name')
    createTree() {
        this._nodeRoot = this.createSubTree(this._filter);
    }
    createSubTree(filter) {
        let node = null;
        let filterNodeType = filterParser_1.FilterParser.getFilterNodeType(filter);
        if (filterNodeType == filterNode_1.FilterNodeType.EXPRESSION) {
            let parser = filterParser_1.FilterParser.parse(filter);
            node = filterNode_1.FilterNode.createExpressionNode(filter, parser.filterOperator);
            // NOT operator has ONLY right node
            if (parser.filterOperator != filterNode_1.FilterOperator.NOT) {
                node.leftNode = this.createSubTree(parser.leftFilterExp);
            }
            // IN operator is ALWAYS followed by right VALUES node
            if (parser.filterOperator == filterNode_1.FilterOperator.IN) {
                node.rightNode = new filterNode_1.FilterNode(parser.rightFilterExp, filterNode_1.FilterNodeType.VALUES);
            }
            else {
                node.rightNode = this.createSubTree(parser.rightFilterExp);
            }
        }
        else {
            node = new filterNode_1.FilterNode(filter, filterNodeType);
        }
        return node;
    }
    getTree() {
        return this._nodeRoot;
    }
    getSelectedRecords() {
        let selectedRecords = [];
        for (let record of this._model.records) {
            if (filterEvaluator_1.FilterEvaluator.evaluateTree(record, this._nodeRoot)) {
                selectedRecords.push(record);
            }
        }
        return selectedRecords;
    }
}
exports.FilterSelector = FilterSelector;
