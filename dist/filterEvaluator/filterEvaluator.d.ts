import { Record } from "../record";
import { IFilterNode } from "./filterNode";
export declare class FilterEvaluator {
    private _record;
    private _nodeRoot;
    private constructor();
    static evaluateTree(record: Record, nodeRoot: IFilterNode | null): boolean;
    private evaluateTree;
    private evaluateSubTree;
    getValuesSeperatedList(node: IFilterNode): string[];
}
//# sourceMappingURL=filterEvaluator.d.ts.map