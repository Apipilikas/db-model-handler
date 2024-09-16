"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const _1 = require(".");
const modelArray_1 = require("./arrays/modelArray");
const relationArray_1 = require("./arrays/relationArray");
const relation_1 = require("./relation");
const errors_1 = require("./utils/errors");
class Schema {
    constructor(schemaName) {
        this._isInitialized = false;
        this._schemaName = schemaName;
        this._models = new modelArray_1.ModelArray(this);
        this._relations = new relationArray_1.RelationArray(this);
        this.initSchema();
        this._isInitialized = true;
    }
    get schemaName() {
        return this._schemaName;
    }
    get models() {
        return this._models;
    }
    get relations() {
        return this._relations;
    }
    /**
     * @internal
     */
    get isInitialized() {
        return this._isInitialized;
    }
    static deserializeStructure(obj) {
        let schemaName = errors_1.FormatError.getValueOrThrow(obj, Schema.NAME_KEY);
        let models = errors_1.FormatError.getValueOrThrow(obj, Schema.MODELS_KEY);
        let relations = errors_1.FormatError.getValueOrThrow(obj, Schema.RELATIONS_KEY);
        let initFun = Schema.prototype.initSchema;
        Schema.prototype.initSchema = function () {
            models.forEach(model => this._models.push(_1.Model.deserializeStructure(model)));
            relations.forEach(relation => this._relations.push(relation_1.Relation.serializeStructure(this, relation)));
        };
        let schema = new Schema(schemaName);
        Schema.prototype.initSchema = initFun;
        return schema;
    }
    initSchema() {
        throw new errors_1.NotInitializedSchemaError(this.schemaName);
    }
    pushNewRelation(relationName, parentField, childField) {
        let relation = new relation_1.Relation(relationName, parentField, childField);
        this._relations.push(relation);
        return relation;
    }
    hasChanges() {
        for (let model of this._models) {
            if (model.hasChanges())
                return true;
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
        let obj = {};
        this._models.forEach(model => obj[model.modelName] = model.getChanges());
        return obj;
    }
    getChangesForSave() {
        let obj = {};
        this._models.forEach(model => obj[model.modelName] = model.getChangesForSave());
        return obj;
    }
    serialize() {
        let obj = {};
        obj[Schema.NAME_KEY] = this._schemaName;
        this._models.forEach(model => obj[model.modelName] = model.serialize());
        return obj;
    }
    serializeStructure() {
        let obj = {};
        let modelsArray = [];
        let relationsArray = [];
        this._models.forEach(model => modelsArray.push(model.serializeStructure()));
        this._relations.forEach(relation => relationsArray.push(relation.deserializeStructure()));
        obj[Schema.NAME_KEY] = this._schemaName;
        obj[Schema.MODELS_KEY] = modelsArray;
        obj[Schema.RELATIONS_KEY] = relationsArray;
        return obj;
    }
}
exports.Schema = Schema;
Schema.NAME_KEY = "name";
Schema.MODELS_KEY = "models";
Schema.RELATIONS_KEY = "relations";
