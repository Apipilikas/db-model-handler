import { Record } from "../record";
export declare class FilterEvaluator {
    private filter;
    private filterNodeRoot;
    constructor(filter: string);
    createTree(): void;
    evaluate(record: Record): boolean;
}
//# sourceMappingURL=filterEvaluator.d.ts.map