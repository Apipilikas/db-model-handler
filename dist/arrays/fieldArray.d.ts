import { Field } from "../field";
import { Model } from "../model";
import { BaseArray } from "./baseArray";
export declare class FieldArray extends BaseArray<Field> {
    private _model;
    constructor(model: Model);
    push(...items: Field[]): number;
    removeByFieldName(fieldName: string): Field;
    findByFieldName(fieldName: string): Field;
}
//# sourceMappingURL=fieldArray.d.ts.map