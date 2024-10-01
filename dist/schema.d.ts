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
    /**
     * @constructor Schema constructor
     * @param schemaName The schema name
     */
    constructor(schemaName: string);
    get schemaName(): string;
    get models(): ModelArray;
    get relations(): RelationArray;
    /**
     * Deserializes JSON format object into Schema instance.
     * @param obj The JSON format object. If the input is string then it will be parsed into JSON.
     * @example
     * {
     *   "schemaName": "schemaName",
     *   "models": [
     *     {
     *       "modelName": "modelName",
     *       "fields": [
     *         {
     *           "fieldName": "field1Name",
     *           "dataType": "string",
     *           "primaryKey": true,
     *           "readOnly": true,
     *           "nonStored": false
     *         }
     *       ]
     *     }
     *   ],
     *   "relations": [
     *     {
     *       "relationName": "relationName1",
     *       "parentModelName": "parentModel1Name",
     *       "parentFieldName": "parentField1Name",
     *       "childModelName": "childModel1Name",
     *       "childFieldName": "childField1Name"
     *     }
     *   ]
     * }
     */
    static deserializeStructure(obj: any): Schema;
    /**
     * Initializes the schema. Relations and models should be initialized here.
     */
    initSchema(): void;
    /**
     * Pushes new relation into the RelationArray/
     * @param relationName The relation name
     * @param parentField The parent field
     * @param childField The child field
     */
    pushNewRelation(relationName: string, parentField: Field, childField: Field, cascadeUpdate?: boolean, cascadeDelete?: boolean): Relation;
    /**
     * Shows whether models have changes or not.
     */
    hasChanges(): boolean;
    /**
     * Commits changes to all models.
     */
    acceptChanges(): void;
    /**
     * Rolls back changes in every model.
     */
    rejectChanges(): void;
    /**
     * Gets changes of each model into JSON format.
     * @returns
     */
    getChanges(): {
        [k: string]: any;
    };
    /**
     * Gets changes of each model excluding non stored fields into JSON format.
     * @returns
     */
    getChangesForSave(): {
        [k: string]: any;
    };
    /**
     * Serializes every record of every model into JSON format.
     */
    serialize(): {
        [k: string]: any;
    };
    /**
     * Serializes only the important information of every record of every model into JSON format.
     */
    serializeForDisplay(): {
        [k: string]: any;
    };
    /**
     * Deserializes the JSON object into schema models.
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     */
    deserialize(obj: any): void;
    /**
     * Serializes Schema structure into JSON format.
     */
    serializeStructure(): {
        [k: string]: any;
    };
}
//# sourceMappingURL=schema.d.ts.map