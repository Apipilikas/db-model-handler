"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const _1 = require(".");
const modelArray_1 = require("./arrays/modelArray");
const relationArray_1 = require("./arrays/relationArray");
const relation_1 = require("./relation");
const dataTypeValidator_1 = require("./utils/dataTypeValidator");
const errors_1 = require("./utils/errors");
class Schema {
    /**
     * @constructor Schema constructor
     * @param schemaName The schema name
     */
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
    static deserializeStructure(obj) {
        if (dataTypeValidator_1.DataTypeValidator.isString(obj))
            obj = JSON.parse(obj);
        let schemaName = errors_1.FormatError.getValueOrThrow(obj, Schema.NAME_KEY);
        let models = errors_1.FormatError.getValueOrThrow(obj, Schema.MODELS_KEY);
        let relations = errors_1.FormatError.getValueOrThrow(obj, Schema.RELATIONS_KEY);
        let initFun = Schema.prototype.initSchema;
        Schema.prototype.initSchema = function () {
            models.forEach(model => this._models.push(_1.Model.deserializeStructure(model)));
            relations.forEach(relation => this._relations.push(relation_1.Relation.deserializeStructure(this, relation)));
        };
        let schema = new Schema(schemaName);
        Schema.prototype.initSchema = initFun;
        return schema;
    }
    /**
     * Initializes the schema. Relations and models should be initialized here.
     */
    initSchema() {
        throw new errors_1.NotInitializedSchemaError(this.schemaName);
    }
    /**
     * Pushes new relation into the RelationArray/
     * @param relationName The relation name
     * @param parentField The parent field
     * @param childField The child field
     */
    pushNewRelation(relationName, parentField, childField, cascadeUpdate = false, cascadeDelete = false) {
        let relation = new relation_1.Relation(relationName, parentField, childField, cascadeUpdate, cascadeDelete);
        this._relations.push(relation);
        return relation;
    }
    /**
     * Shows whether models have changes or not.
     */
    hasChanges() {
        for (let model of this._models) {
            if (model.hasChanges())
                return true;
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
        let obj = {};
        this._models.forEach(model => obj[model.modelName] = model.getChanges());
        return obj;
    }
    /**
     * Gets changes of each model excluding non stored fields into JSON format.
     * @returns
     */
    getChangesForSave() {
        let obj = {};
        this._models.forEach(model => obj[model.modelName] = model.getChangesForSave());
        return obj;
    }
    /**
     * Serializes every record of every model into JSON format.
     */
    serialize() {
        let obj = {};
        obj[Schema.NAME_KEY] = this._schemaName;
        this._models.forEach(model => obj[model.modelName] = model.serialize());
        return obj;
    }
    /**
     * Serializes only the important information of every record of every model into JSON format.
     */
    serializeForDisplay() {
        let obj = {};
        for (let model of this._models) {
            obj[model.modelName] = model.serializeForDisplay();
        }
        return obj;
    }
    /**
     * Deserializes the JSON object into schema models.
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     */
    deserialize(obj) {
        if (dataTypeValidator_1.DataTypeValidator.isString(obj))
            obj = JSON.parse(obj);
        for (let model of this._models) {
            let modelObj = errors_1.FormatError.getValueOrThrow(obj, model.modelName);
            model.deserialize(modelObj);
        }
    }
    /**
     * Serializes Schema structure into JSON format.
     */
    serializeStructure() {
        let obj = {};
        let modelsArray = [];
        let relationsArray = [];
        this._models.forEach(model => modelsArray.push(model.serializeStructure()));
        this._relations.forEach(relation => relationsArray.push(relation.serializeStructure()));
        obj[Schema.NAME_KEY] = this._schemaName;
        obj[Schema.MODELS_KEY] = modelsArray;
        obj[Schema.RELATIONS_KEY] = relationsArray;
        return obj;
    }
}
exports.Schema = Schema;
Schema.NAME_KEY = "schemaName";
Schema.MODELS_KEY = "models";
Schema.RELATIONS_KEY = "relations";
