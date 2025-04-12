import { Model } from "../model";
import { Record } from "../record";
import { IFilterNode } from "./filterNode";
export declare class FilterSelector {
    private _model;
    private _filter;
    private _nodeRoot;
    constructor(filter: string, model: Model);
    get filter(): string;
    get nodeRoot(): IFilterNode | null;
    static getSelectedRecords(filter: string, model: Model): Record[];
    private createTree;
    private createSubTree;
    getTree(): IFilterNode | null;
    getSelectedRecords(): Record[];
}
//# sourceMappingURL=filterSelector.d.ts.map