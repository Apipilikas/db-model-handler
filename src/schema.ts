import { Model } from ".";
import { ModelArray } from "./arrays/modelArray";
import { RelationArray } from "./arrays/relationArray";
import { Field } from "./field";
import { Relation } from "./relation";
import { DataTypeValidator } from "./utils/dataTypeValidator";
import { FormatError, NotInitializedSchemaError } from "./utils/errors";

export class Schema {
    static NAME_KEY = "schemaName";
    static MODELS_KEY = "models";
    static RELATIONS_KEY = "relations";

    private _schemaName : string;
    private _models : ModelArray;
    private _relations : RelationArray;
    private _isInitialized : boolean = false;

    /**
     * @constructor Schema constructor
     * @param schemaName The schema name
     */
    constructor(schemaName : string) {
        this._schemaName = schemaName;
        this._models = new ModelArray(this);
        this._relations = new RelationArray(this);

        this.initSchema();

        this._isInitialized = true;
    }

    get schemaName() {
        return this._schemaName;
    }

    get models() : ModelArray {
        return this._models;
    }

    get relations() : RelationArray {
        return this._relations;
    }

    /**
     * @internal
     */
    get isInitialized() {
        return this._isInitialized;
    }

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
    static deserializeStructure(obj : any) : Schema {
        if (DataTypeValidator.isString(obj)) obj = JSON.parse(obj);

        let schemaName = FormatError.getValueOrThrow<string>(obj, Schema.NAME_KEY);
        let models = FormatError.getValueOrThrow<any[]>(obj, Schema.MODELS_KEY);
        let relations = FormatError.getValueOrThrow<any[]>(obj, Schema.RELATIONS_KEY);

        let initFun = Schema.prototype.initSchema;

        Schema.prototype.initSchema = function() {
            models.forEach(model => this._models.push(Model.deserializeStructure(model)));
            relations.forEach(relation => this._relations.push(Relation.deserializeStructure(this, relation)));
        }

        let schema = new Schema(schemaName);

        Schema.prototype.initSchema = initFun;

        return schema;
    }

    /**
     * Initializes the schema. Relations and models should be initialized here.
     */
    initSchema() {
        throw new NotInitializedSchemaError(this.schemaName);
    }

    /**
     * Pushes new relation into the RelationArray/
     * @param relationName The relation name
     * @param parentField The parent field
     * @param childField The child field
     */
    pushNewRelation(relationName : string, parentField : Field, childField : Field, cascadeUpdate : boolean = false, cascadeDelete : boolean = false) {
        let relation = new Relation(relationName, parentField, childField, cascadeUpdate, cascadeDelete);
        this._relations.push(relation);
        return relation;
    }

    /**
     * Shows whether models have changes or not.
     */
    hasChanges() : boolean {
        for (let model of this._models) {
            if (model.hasChanges()) return true;
        }

        return false;
    }

    /**
     * Commits changes to all models.
     */
    acceptChanges() {
        this._models.forEach(model => model.acceptChanges());
    }

    /**
     * Rolls back changes in every model.
     */
    rejectChanges() {
        this._models.forEach(model => model.rejectChanges());
    }

    /**
     * Gets changes of each model into JSON format.
     * @returns 
     */
    getChanges() {
        let obj : {[k: string]: any} = {};

        this._models.forEach(model => obj[model.modelName] = model.getChanges());

        return obj;
    }

    /**
     * Gets changes of each model excluding non stored fields into JSON format.
     * @returns 
     */
    getChangesForSave() {
        let obj : {[k: string]: any} = {};

        this._models.forEach(model => obj[model.modelName] = model.getChangesForSave());

        return obj;
    }

    /**
     * Serializes every record of every model into JSON format.
     */
    serialize() {
        let obj : {[k: string]: any} = {};

        obj[Schema.NAME_KEY] = this._schemaName;
        this._models.forEach(model => obj[model.modelName] = model.serialize());

        return obj;
    }

    /**
     * Serializes only the important information of every record of every model into JSON format.
     */
    serializeForDisplay() {
        let obj : {[k: string]: any} = {};
        for (let model of this._models) {
            obj[model.modelName] = model.serializeForDisplay();
        }

        return obj;
    }

    /**
     * Deserializes the JSON object into schema models.
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     */
    deserialize(obj : any) {
        if (DataTypeValidator.isString(obj)) obj = JSON.parse(obj);

        for (let model of this._models) {
            let modelObj = FormatError.getValueOrThrow<any>(obj, model.modelName);
            model.deserialize(modelObj);
        }
    }

    /**
     * Serializes Schema structure into JSON format.
     */
    serializeStructure() {
        let obj: {[k: string]: any} = {};
        let modelsArray : any[] = [];
        let relationsArray : any[] = [];

        this._models.forEach(model => modelsArray.push(model.serializeStructure()));
        this._relations.forEach(relation => relationsArray.push(relation.serializeStructure()));

        obj[Schema.NAME_KEY] = this._schemaName;
        obj[Schema.MODELS_KEY] = modelsArray;
        obj[Schema.RELATIONS_KEY] = relationsArray;

        return obj;
    }
}