"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterEvaluator = void 0;
const recordUtils_1 = require("../utils/recordUtils");
const filterNode_1 = require("./filterNode");
const filterParser_1 = require("./filterParser");
class FilterEvaluator {
    constructor(record, nodeRoot) {
        this._record = record;
        this._nodeRoot = nodeRoot;
    }
    static evaluateTree(record, nodeRoot) {
        let evaluator = new FilterEvaluator(record, nodeRoot);
        return evaluator.evaluateTree();
    }
    evaluateTree() {
        if (this._nodeRoot == null)
            return false;
        return this.evaluateSubTree(this._nodeRoot);
    }
    evaluateSubTree(node) {
        var _a;
        if ((node === null || node === void 0 ? void 0 : node.type) == filterNode_1.FilterNodeType.EXPRESSION) {
            switch (node.operator) {
                case filterNode_1.FilterOperator.NOT:
                    return !this.evaluateSubTree(node.rightNode);
                case filterNode_1.FilterOperator.Equal:
                    return this.evaluateSubTree(node.leftNode) == this.evaluateSubTree(node.rightNode);
                case filterNode_1.FilterOperator.NOTEqual:
                    return this.evaluateSubTree(node.leftNode) != this.evaluateSubTree(node.rightNode);
                case filterNode_1.FilterOperator.AND:
                    return this.evaluateSubTree(node.leftNode) && this.evaluateSubTree(node.rightNode);
                case filterNode_1.FilterOperator.OR:
                    return this.evaluateSubTree(node.leftNode) || this.evaluateSubTree(node.rightNode);
                case filterNode_1.FilterOperator.Greater:
                    return this.evaluateSubTree(node.leftNode) > this.evaluateSubTree(node.rightNode);
                case filterNode_1.FilterOperator.GreaterOREqual:
                    return this.evaluateSubTree(node.leftNode) >= this.evaluateSubTree(node.rightNode);
                case filterNode_1.FilterOperator.Less:
                    return this.evaluateSubTree(node.leftNode) < this.evaluateSubTree(node.rightNode);
                case filterNode_1.FilterOperator.LessOREqual:
                    return this.evaluateSubTree(node.leftNode) <= this.evaluateSubTree(node.rightNode);
                case filterNode_1.FilterOperator.IN:
                    return (_a = this.evaluateSubTree(node.rightNode)) === null || _a === void 0 ? void 0 : _a.includes(this.evaluateSubTree(node.leftNode));
                case filterNode_1.FilterOperator.NONE:
                    break;
            }
        }
        else if ((node === null || node === void 0 ? void 0 : node.type) == filterNode_1.FilterNodeType.FIELD) {
            return recordUtils_1.RecordUtils.getRecordValue(this._record, node.value);
        }
        else if ((node === null || node === void 0 ? void 0 : node.type) == filterNode_1.FilterNodeType.VALUE) {
            return filterParser_1.FilterParser.replaceQuotes(node.value, 0);
        }
        else if ((node === null || node === void 0 ? void 0 : node.type) == filterNode_1.FilterNodeType.VALUES) {
            return this.getValuesSeperatedList(node);
        }
        return null;
    }
    getValuesSeperatedList(node) {
        let value = filterParser_1.FilterParser.replaceChars(node.value, 0);
        value = value.replace(/\'/gi, "");
        let values = value.split(",").map(val => { return val.trim(); });
        return values;
    }
}
exports.FilterEvaluator = FilterEvaluator;
