import { Field } from "./field";
import { Schema } from "./schema";
import { FormatError } from "./utils/errors";

export class Relation {
    static NAME_KEY = "relationName";
    static PARENT_MODEL_NAME_KEY = "parentModelName";
    static CHILD_MODEL_NAME_KEY = "childModelName";
    static PARENT_FIELD_NAME_KEY = "parentFieldName";
    static CHILD_FIELD_NAME_KEY = "childFieldName";

    private _relationName : string;
    private _parentField : Field;
    private _childField : Field;

    /**
     * @constructor Relation contructor
     * @param relationName The relation name
     * @param parentField The parent field
     * @param childField The referenced child field
     */
    constructor(relationName : string, parentField : Field, childField : Field) {
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
    static deserializeStructure(schema : Schema, obj : any) {
        let relationName = FormatError.getValueOrThrow<string>(obj, Relation.NAME_KEY);
        let parentModelName = FormatError.getValueOrThrow<string>(obj, Relation.PARENT_MODEL_NAME_KEY);
        let parentFieldName = FormatError.getValueOrThrow<string>(obj, Relation.PARENT_FIELD_NAME_KEY);
        let childModelName = FormatError.getValueOrThrow<string>(obj, Relation.CHILD_MODEL_NAME_KEY);
        let childFieldName = FormatError.getValueOrThrow<string>(obj, Relation.CHILD_FIELD_NAME_KEY);

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
        let obj : {[k: string]: any} = {};

        obj[Relation.NAME_KEY] = this._relationName;
        obj[Relation.PARENT_MODEL_NAME_KEY] = this.parentModel.modelName;
        obj[Relation.PARENT_FIELD_NAME_KEY] = this._parentField.fieldName;
        obj[Relation.CHILD_MODEL_NAME_KEY] = this.childModel.modelName;
        obj[Relation.CHILD_FIELD_NAME_KEY] = this._childField.fieldName;

        return obj;
    }
}