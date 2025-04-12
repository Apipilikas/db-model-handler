import { Model } from "../model";
import { Schema } from "../schema";
import { BaseArray } from "./baseArray";
export declare class ModelArray extends BaseArray<Model> {
    private _schema;
    constructor(schema: Schema);
    push(...items: Model[]): number;
    findByModelName(modelName: string): Model;
    contains(modelName: string): boolean;
}
//# sourceMappingURL=modelArray.d.ts.map