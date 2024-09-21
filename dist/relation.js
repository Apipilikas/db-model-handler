"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relation = void 0;
const errors_1 = require("./utils/errors");
class Relation {
    /**
     * @constructor Relation contructor
     * @param relationName The relation name
     * @param parentField The parent field
     * @param childField The referenced child field
     */
    constructor(relationName, parentField, childField) {
        this._relationName = relationName;
        this._childField = childField;
        this._parentField = parentField;
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
        let parentModel = schema.models.findByModelName(parentModelName);
        let childModel = schema.models.findByModelName(childModelName);
        let parentField = parentModel.fields.findByFieldName(parentFieldName);
        let childField = childModel.fields.findByFieldName(childFieldName);
        return new Relation(relationName, parentField, childField);
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
        return obj;
    }
}
exports.Relation = Relation;
Relation.NAME_KEY = "relationName";
Relation.PARENT_MODEL_NAME_KEY = "parentModelName";
Relation.CHILD_MODEL_NAME_KEY = "childModelName";
Relation.PARENT_FIELD_NAME_KEY = "parentFieldName";
Relation.CHILD_FIELD_NAME_KEY = "childFieldName";
