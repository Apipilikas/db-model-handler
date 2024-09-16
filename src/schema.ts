import { Model } from ".";
import { ModelArray } from "./arrays/modelArray";
import { RelationArray } from "./arrays/relationArray";
import { Field } from "./field";
import { Relation } from "./relation";
import { FormatError, NotInitializedSchemaError } from "./utils/errors";

export class Schema {
    static NAME_KEY = "name";
    static MODELS_KEY = "models";
    static RELATIONS_KEY = "relations";

    private _schemaName : string;
    private _models : ModelArray;
    private _relations : RelationArray;
    private _isInitialized : boolean = false;

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

    static deserializeStructure(obj : any) {
        let schemaName = FormatError.getValueOrThrow<string>(obj, Schema.NAME_KEY);
        let models = FormatError.getValueOrThrow<any[]>(obj, Schema.MODELS_KEY);
        let relations = FormatError.getValueOrThrow<any[]>(obj, Schema.RELATIONS_KEY);

        let initFun = Schema.prototype.initSchema;

        Schema.prototype.initSchema = function() {
            models.forEach(model => this._models.push(Model.deserializeStructure(model)));
            relations.forEach(relation => this._relations.push(Relation.serializeStructure(this, relation)));
        }

        let schema = new Schema(schemaName);

        Schema.prototype.initSchema = initFun;

        return schema;
    }

    initSchema() {
        throw new NotInitializedSchemaError(this.schemaName);
    }

    pushNewRelation(relationName : string, parentField : Field, childField : Field) {
        let relation = new Relation(relationName, parentField, childField);
        this._relations.push(relation);
        return relation;
    }

    hasChanges() {
        for (let model of this._models) {
            if (model.hasChanges()) return true;
        }

        return false;
    }

    acceptChanges() {
        this._models.forEach(model => model.acceptChanges());
    }

    rejectChanges() {
        this._models.forEach(model => model.rejectChanges());
    }

    getChanges() {
        let obj : {[k: string]: any} = {};

        this._models.forEach(model => obj[model.modelName] = model.getChanges());

        return obj;
    }

    getChangesForSave() {
        let obj : {[k: string]: any} = {};

        this._models.forEach(model => obj[model.modelName] = model.getChangesForSave());

        return obj;
    }

    serialize() {
        let obj : {[k: string]: any} = {};

        obj[Schema.NAME_KEY] = this._schemaName;
        this._models.forEach(model => obj[model.modelName] = model.serialize());

        return obj;
    }

    serializeStructure() {
        let obj: {[k: string]: any} = {};
        let modelsArray : any[] = [];
        let relationsArray : any[] = [];

        this._models.forEach(model => modelsArray.push(model.serializeStructure()));
        this._relations.forEach(relation => relationsArray.push(relation.deserializeStructure()));

        obj[Schema.NAME_KEY] = this._schemaName;
        obj[Schema.MODELS_KEY] = modelsArray;
        obj[Schema.RELATIONS_KEY] = relationsArray;

        return obj;
    }
}