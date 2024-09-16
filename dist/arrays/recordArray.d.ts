import { Model } from "../model";
import { Record } from "../record";
import { BaseArray } from "./baseArray";
export declare class RecordArray extends BaseArray<Record> {
    private _model;
    constructor(model: Model);
    push(...items: Record[]): number;
    private isRecordUnique;
    private getRecordValue;
}
//# sourceMappingURL=recordArray.d.ts.map