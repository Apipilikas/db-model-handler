import { Field } from "./field";
import { Schema } from "./schema";
export declare class Relation {
    static NAME_KEY: string;
    static PARENT_MODEL_NAME_KEY: string;
    static CHILD_MODEL_NAME_KEY: string;
    static PARENT_FIELD_NAME_KEY: string;
    static CHILD_FIELD_NAME_KEY: string;
    private _relationName;
    private _parentField;
    private _childField;
    constructor(relationName: string, parentField: Field, childField: Field);
    get relationName(): string;
    get parentField(): Field;
    get childField(): Field;
    get parentModel(): import("./model").Model;
    get childModel(): import("./model").Model;
    static serializeStructure(schema: Schema, obj: any): Relation;
    deserializeStructure(): {
        [k: string]: any;
    };
}
//# sourceMappingURL=relation.d.ts.map