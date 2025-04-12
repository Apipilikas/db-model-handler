import { Model } from "../model";
import { Relation } from "../relation";
import { Schema } from "../schema";
import { BaseArray } from "./baseArray";
export declare class BaseRelationArray extends BaseArray<Relation> {
    removeByRelationName(relationName: string): Relation;
    findIndexByRelationName(relationName: string): number;
    findByRelationName(relationName: string): Relation | undefined;
    findByParentFieldName(fieldName: string): Relation | undefined;
    findByChildFieldName(fieldName: string): Relation | undefined;
    filterByParentFieldName(fieldName: string): Relation[];
    filterByChildFieldName(fieldName: string): Relation[];
    findCascadeUpdatedOnes(): Relation[];
    findCascadeDeletedOnes(): Relation[];
}
export declare class RelationArray extends BaseRelationArray {
    private _schema;
    constructor(schema: Schema);
    push(...items: Relation[]): number;
}
export declare class RelationModelArray extends BaseRelationArray {
    private _model;
    private _parentRelation;
    constructor(model: Model, parentRelation: boolean);
    push(...items: Relation[]): number;
}
//# sourceMappingURL=relationArray.d.ts.map