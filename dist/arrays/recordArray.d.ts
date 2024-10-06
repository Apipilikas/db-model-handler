import { Model } from "../model";
import { Record } from "../record";
import { BaseArray } from "./baseArray";
export declare class RecordArray extends BaseArray<Record> {
    private _model;
    constructor(model: Model);
    push(...items: Record[]): number;
    findByPrimaryKeys(...values: any[]): Record | null;
    private isRecordUnique;
}
//# sourceMappingURL=recordArray.d.ts.map