import { Field } from "./field";
import { Schema } from "./schema";
export declare class Relation {
    static NAME_KEY: string;
    static PARENT_MODEL_NAME_KEY: string;
    static CHILD_MODEL_NAME_KEY: string;
    static PARENT_FIELD_NAME_KEY: string;
    static CHILD_FIELD_NAME_KEY: string;
    static CASCADE_UPDATE_KEY: string;
    static CASCADE_DELETE_KEY: string;
    private _relationName;
    private _parentField;
    private _childField;
    private _cascadeUpdate;
    private _cascadeDelete;
    /**
     * @constructor Relation contructor
     * @param relationName The relation name
     * @param parentField The parent field
     * @param childField The referenced child field
     */
    constructor(relationName: string, parentField: Field, childField: Field);
    /**
     * @constructor Relation contructor
     * @param relationName The relation name
     * @param parentField The parent field
     * @param childField The referenced child field
     * @param cascadeUpdate Update all the child records
     * @param cascadeDelete Delete all the child records
     */
    constructor(relationName: string, parentField: Field, childField: Field, cascadeUpdate: boolean, cascadeDelete: boolean);
    get relationName(): string;
    get parentField(): Field;
    get childField(): Field;
    get parentModel(): import("./model").Model;
    get childModel(): import("./model").Model;
    get cascadeUpdate(): boolean;
    set cascadeUpdate(value: boolean);
    get cascadeDelete(): boolean;
    set cascadeDelete(value: boolean);
    /**
     * Deserializes JSON format object into Relation instance.
     * @param schema The schema
     * @param obj The JSON structure format object. If the input is string then it will be parsed into JSON.
     * @example
     * {
     *   "relationName": "relationName1",
     *   "parentModelName": "parentModel1Name",
     *   "parentFieldName": "parentField1Name",
     *   "childModelName": "childModel1Name",
     *   "childFieldName": "childField1Name"
     * }
     */
    static deserializeStructure(schema: Schema, obj: any): Relation;
    /**
     * Serializes Relation structure into JSON format.
     */
    serializeStructure(): {
        [k: string]: any;
    };
}
//# sourceMappingURL=relation.d.ts.map