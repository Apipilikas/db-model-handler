import { Model } from "../model";
import { Record } from "../record";
import { BaseArray } from "./baseArray";
export declare class RecordArray extends BaseArray<Record> {
    private _model;
    constructor(model: Model);
    push(...items: Record[]): number;
    findByPrimaryKey(...values: any[]): Record | null;
    findByFieldName(fieldName: string, value: any): Record | undefined;
    private isRecordUnique;
}
//# sourceMappingURL=recordArray.d.ts.map