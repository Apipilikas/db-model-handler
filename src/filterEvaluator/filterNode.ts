export interface IFilterNode {
    value : string 
    type : FilterNodeType
    leftNode : IFilterNode | null
    operator : FilterOperator
    rightNode : IFilterNode | null
}

export enum FilterNodeType {
    NOTHING = 0,
    EXPRESSION = 1,
    FIELD = 2,
    VALUE = 3,
    VALUES = 4
}

export enum FilterOperator {
    NONE = "NONE",
    NOT = "NOT",
    Equal = "EQUAL",
    NOTEqual = "NOTEQUAL",
    AND = "AND",
    OR = "OR",
    Greater = "GREATER",
    GreaterOREqual = "GREATEROREQUAL",
    Less = "LESS",
    LessOREqual = "LESSOREQUAL",
    IN = "IN"
}

export abstract class FilterOperatorUtils {
    static getFilterOperator(str : string) {
        let upperStr = str.toUpperCase();
        
        switch (upperStr) {
            case "NOT" : return FilterOperator.NOT;
            case "==":
            case "=" : return FilterOperator.Equal;
            case "!=" :
            case "<>" : return FilterOperator.NOTEqual;
            case "AND" : return FilterOperator.AND;
            case "OR" : return FilterOperator.OR;
            case ">" : return FilterOperator.Greater;
            case ">=" : return FilterOperator.GreaterOREqual;
            case "<" : return FilterOperator.Less;
            case "<=" : return FilterOperator.LessOREqual;
            case "IN" : return FilterOperator.IN;
        }

        return FilterOperator.NONE;
    }

    static isFilterOperator(str : string, filterOperator : FilterOperator) {
        return this.getFilterOperator(str) == filterOperator;
    }
}

export class FilterNode implements IFilterNode {
    private _value : string = "";
    private _type: FilterNodeType = FilterNodeType.NOTHING;
    private _leftNode: IFilterNode | null = null;
    private _operator: FilterOperator = FilterOperator.NONE;
    private _rightNode: IFilterNode | null = null;

    constructor(value : string, type : FilterNodeType) {
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
        if (this._type != FilterNodeType.EXPRESSION) throw new Error("Node is set as a LEAF node");
        this._leftNode = value;
    }

    get operator() {
        return this._operator;
    }

    get rightNode() {
        return this._rightNode;
    }

    set rightNode(value) {
        if (this._type != FilterNodeType.EXPRESSION) throw new Error("Node is set as a LEAF node");
        this._rightNode = value;
    }

    static createExpressionNode(filter : string, operator : FilterOperator) : IFilterNode {
        let node = new FilterNode(filter, FilterNodeType.EXPRESSION);
        node._operator = operator;
        return node;
    }

    static createFieldNode(fieldName : string) : IFilterNode {
        let node = new FilterNode(fieldName, FilterNodeType.FIELD);
        return node;
    }

    static createValueNode(value : string) : IFilterNode {
        let node = new FilterNode(value, FilterNodeType.VALUE);
        return node;
    }

    static createValuesNode(seperatedValues : string) : IFilterNode {
        let node = new FilterNode(seperatedValues, FilterNodeType.VALUES);
        return node;
    }
}