import { ModelArray } from "./arrays/modelArray";
import { RelationArray } from "./arrays/relationArray";
import { Field } from "./field";
import { Relation } from "./relation";
export declare class Schema {
    static NAME_KEY: string;
    static MODELS_KEY: string;
    static RELATIONS_KEY: string;
    private _schemaName;
    private _models;
    private _relations;
    private _isInitialized;
    constructor(schemaName: string);
    get schemaName(): string;
    get models(): ModelArray;
    get relations(): RelationArray;
    static deserializeStructure(obj: any): Schema;
    initSchema(): void;
    pushNewRelation(relationName: string, parentField: Field, childField: Field): Relation;
    hasChanges(): boolean;
    acceptChanges(): void;
    rejectChanges(): void;
    getChanges(): {
        [k: string]: any;
    };
    getChangesForSave(): {
        [k: string]: any;
    };
    serialize(): {
        [k: string]: any;
    };
    serializeStructure(): {
        [k: string]: any;
    };
}
//# sourceMappingURL=schema.d.ts.map