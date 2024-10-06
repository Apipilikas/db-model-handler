import { Record } from "../record";
import { RecordUtils } from "../utils/recordUtils";
import { FilterOperator, FilterNodeType, IFilterNode } from "./filterNode";
import { FilterParser } from "./filterParser";

export class FilterEvaluator {
    private _record : Record;
    private _nodeRoot : IFilterNode | null;

    private constructor(record : Record, nodeRoot : IFilterNode | null) {
        this._record = record;
        this._nodeRoot = nodeRoot;
    }

    static evaluateTree(record : Record, nodeRoot : IFilterNode | null) {
        let evaluator = new FilterEvaluator(record, nodeRoot);
        return evaluator.evaluateTree();
    }

    private evaluateTree() : boolean {
        if (this._nodeRoot == null) return false;

        return this.evaluateSubTree(this._nodeRoot);
    }

    private evaluateSubTree(node : IFilterNode | null) : any {
        if (node?.type == FilterNodeType.EXPRESSION) {
            switch (node.operator) {
                case FilterOperator.NOT:
                    return !this.evaluateSubTree(node.rightNode);
                case FilterOperator.Equal:
                    return this.evaluateSubTree(node.leftNode) == this.evaluateSubTree(node.rightNode);
                case FilterOperator.NOTEqual:
                    return this.evaluateSubTree(node.leftNode) != this.evaluateSubTree(node.rightNode);
                case FilterOperator.AND:
                    return this.evaluateSubTree(node.leftNode) && this.evaluateSubTree(node.rightNode);
                case FilterOperator.OR:
                    return this.evaluateSubTree(node.leftNode) || this.evaluateSubTree(node.rightNode);
                case FilterOperator.Greater:
                    return this.evaluateSubTree(node.leftNode) > this.evaluateSubTree(node.rightNode);
                case FilterOperator.GreaterOREqual:
                    return this.evaluateSubTree(node.leftNode) >= this.evaluateSubTree(node.rightNode);
                case FilterOperator.Less:
                    return this.evaluateSubTree(node.leftNode) < this.evaluateSubTree(node.rightNode);
                case FilterOperator.LessOREqual:
                    return this.evaluateSubTree(node.leftNode) <= this.evaluateSubTree(node.rightNode);
                case FilterOperator.IN:
                    return (this.evaluateSubTree(node.rightNode) as string[])?.includes(this.evaluateSubTree(node.leftNode));
                case FilterOperator.NONE:
                    break;
            }
        }
        else if (node?.type == FilterNodeType.FIELD) {
            return RecordUtils.getRecordValue(this._record, node.value);
        }
        else if (node?.type == FilterNodeType.VALUE) {
            return FilterParser.replaceQuotes(node.value, 0);
        }
        else if (node?.type == FilterNodeType.VALUES) {
            return this.getValuesSeperatedList(node);
        }

        return null;
    }

    getValuesSeperatedList(node : IFilterNode) {
        let value = FilterParser.replaceChars(node.value, 0);
        value = value.replace(/\'/gi, "");
        let values = value.split(",").map(val => {return val.trim()});
        return values;
    }
}