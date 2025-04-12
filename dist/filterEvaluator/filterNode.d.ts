export interface IFilterNode {
    value: string;
    type: FilterNodeType;
    leftNode: IFilterNode | null;
    operator: FilterOperator;
    rightNode: IFilterNode | null;
}
export declare enum FilterNodeType {
    NOTHING = 0,
    EXPRESSION = 1,
    FIELD = 2,
    VALUE = 3,
    VALUES = 4
}
export declare enum FilterOperator {
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
export declare abstract class FilterOperatorUtils {
    static getFilterOperator(str: string): FilterOperator;
    static isFilterOperator(str: string, filterOperator: FilterOperator): boolean;
}
export declare class FilterNode implements IFilterNode {
    private _value;
    private _type;
    private _leftNode;
    private _operator;
    private _rightNode;
    constructor(value: string, type: FilterNodeType);
    get value(): string;
    get type(): FilterNodeType;
    get leftNode(): IFilterNode | null;
    set leftNode(value: IFilterNode | null);
    get operator(): FilterOperator;
    get rightNode(): IFilterNode | null;
    set rightNode(value: IFilterNode | null);
    static createExpressionNode(filter: string, operator: FilterOperator): IFilterNode;
    static createFieldNode(fieldName: string): IFilterNode;
    static createValueNode(value: string): IFilterNode;
    static createValuesNode(seperatedValues: string): IFilterNode;
}
//# sourceMappingURL=filterNode.d.ts.map