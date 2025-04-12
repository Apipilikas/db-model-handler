"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relation = void 0;
const errors_1 = require("./utils/errors");
class Relation {
    constructor(relationName, parentField, childField, cascadeUpdate = false, cascadeDelete = false) {
        this._cascadeUpdate = true;
        this._cascadeDelete = true;
        this._relationName = relationName;
        this._childField = childField;
        this._parentField = parentField;
        this._cascadeUpdate = cascadeUpdate;
        this._cascadeDelete = cascadeDelete;
    }
    get relationName() {
        return this._relationName;
    }
    get parentField() {
        return this._parentField;
    }
    get childField() {
        return this._childField;
    }
    get parentModel() {
        return this._parentField.model;
    }
    get childModel() {
        return this._childField.model;
    }
    get cascadeUpdate() {
        return this._cascadeUpdate;
    }
    set cascadeUpdate(value) {
        this._cascadeUpdate = value;
    }
    get cascadeDelete() {
        return this._cascadeDelete;
    }
    set cascadeDelete(value) {
        this._cascadeDelete = value;
    }
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
    static deserializeStructure(schema, obj) {
        let relationName = errors_1.FormatError.getValueOrThrow(obj, Relation.NAME_KEY);
        let parentModelName = errors_1.FormatError.getValueOrThrow(obj, Relation.PARENT_MODEL_NAME_KEY);
        let parentFieldName = errors_1.FormatError.getValueOrThrow(obj, Relation.PARENT_FIELD_NAME_KEY);
        let childModelName = errors_1.FormatError.getValueOrThrow(obj, Relation.CHILD_MODEL_NAME_KEY);
        let childFieldName = errors_1.FormatError.getValueOrThrow(obj, Relation.CHILD_FIELD_NAME_KEY);
        let cascadeUpdate = errors_1.FormatError.getValueOrThrow(obj, Relation.CASCADE_UPDATE_KEY);
        let cascadeDelete = errors_1.FormatError.getValueOrThrow(obj, Relation.CASCADE_DELETE_KEY);
        let parentModel = schema.models.findByModelName(parentModelName);
        let childModel = schema.models.findByModelName(childModelName);
        let parentField = parentModel.fields.findByFieldName(parentFieldName);
        let childField = childModel.fields.findByFieldName(childFieldName);
        return new Relation(relationName, parentField, childField, cascadeUpdate, cascadeDelete);
    }
    /**
     * Serializes Relation structure into JSON format.
     */
    serializeStructure() {
        let obj = {};
        obj[Relation.NAME_KEY] = this._relationName;
        obj[Relation.PARENT_MODEL_NAME_KEY] = this.parentModel.modelName;
        obj[Relation.PARENT_FIELD_NAME_KEY] = this._parentField.fieldName;
        obj[Relation.CHILD_MODEL_NAME_KEY] = this.childModel.modelName;
        obj[Relation.CHILD_FIELD_NAME_KEY] = this._childField.fieldName;
        obj[Relation.CASCADE_UPDATE_KEY] = this._cascadeUpdate;
        obj[Relation.CASCADE_DELETE_KEY] = this._cascadeDelete;
        return obj;
    }
}
exports.Relation = Relation;
Relation.NAME_KEY = "relationName";
Relation.PARENT_MODEL_NAME_KEY = "parentModelName";
Relation.CHILD_MODEL_NAME_KEY = "childModelName";
Relation.PARENT_FIELD_NAME_KEY = "parentFieldName";
Relation.CHILD_FIELD_NAME_KEY = "childFieldName";
Relation.CASCADE_UPDATE_KEY = "cascadeUpdate";
Relation.CASCADE_DELETE_KEY = "cascadeDelete";
