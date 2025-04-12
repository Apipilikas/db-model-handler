import { Model } from "../model";
import { Record } from "../record";
import { FilterEvaluator } from "./filterEvaluator";
import { FilterNode, FilterOperator, FilterNodeType, IFilterNode } from "./filterNode";
import { FilterParser } from "./filterParser";

export class FilterSelector {
    private _model : Model;
    private _filter : string
    private _nodeRoot : IFilterNode | null = null;

    constructor(filter : string, model : Model) {
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

    static getSelectedRecords(filter : string, model : Model) {
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

    private createTree() {
        this._nodeRoot = this.createSubTree(this._filter);
    }

    private createSubTree(filter : string) : IFilterNode | null {
        let node : IFilterNode | null = null;
        let filterNodeType = FilterParser.getFilterNodeType(filter);
        
        if (filterNodeType == FilterNodeType.EXPRESSION) {
            let parser = FilterParser.parse(filter);
            node = FilterNode.createExpressionNode(filter, parser.filterOperator);

            // NOT operator has ONLY right node
            if (parser.filterOperator != FilterOperator.NOT) {
                node.leftNode = this.createSubTree(parser.leftFilterExp);
            } 

            // IN operator is ALWAYS followed by right VALUES node
            if (parser.filterOperator == FilterOperator.IN) {
                node.rightNode = new FilterNode(parser.rightFilterExp, FilterNodeType.VALUES);
            }
            else {
                node.rightNode = this.createSubTree(parser.rightFilterExp);
            }
        }
        else {
            node = new FilterNode(filter, filterNodeType);
        }

        return node;
    }

    getTree() {
        return this._nodeRoot;
    }

    getSelectedRecords() {
        let selectedRecords : Record[] = [];
        for (let record of this._model.records) {
            if (FilterEvaluator.evaluateTree(record, this._nodeRoot)) {
                selectedRecords.push(record);
            }
        }

        return selectedRecords;
    }
}