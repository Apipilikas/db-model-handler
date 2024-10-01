import { Field } from "./field";
import { Schema } from "./schema";
import { FormatError } from "./utils/errors";

export class Relation {
    static NAME_KEY = "relationName";
    static PARENT_MODEL_NAME_KEY = "parentModelName";
    static CHILD_MODEL_NAME_KEY = "childModelName";
    static PARENT_FIELD_NAME_KEY = "parentFieldName";
    static CHILD_FIELD_NAME_KEY = "childFieldName";
    static CASCADE_UPDATE_KEY = "cascadeUpdate";
    static CASCADE_DELETE_KEY = "cascadeDelete";

    private _relationName : string;
    private _parentField : Field;
    private _childField : Field;
    private _cascadeUpdate : boolean = true;
    private _cascadeDelete : boolean = true;

    /**
     * @constructor Relation contructor
     * @param relationName The relation name
     * @param parentField The parent field
     * @param childField The referenced child field
     */
    constructor(relationName : string, parentField : Field, childField : Field);

    /**
     * @constructor Relation contructor
     * @param relationName The relation name
     * @param parentField The parent field
     * @param childField The referenced child field
     * @param cascadeUpdate Update all the child records
     * @param cascadeDelete Delete all the child records
     */
    constructor(relationName : string, parentField : Field, childField : Field, cascadeUpdate : boolean, cascadeDelete : boolean);

    constructor(relationName : string, parentField : Field, childField : Field, cascadeUpdate : boolean = false, cascadeDelete : boolean = false) {
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
    static deserializeStructure(schema : Schema, obj : any) {
        let relationName = FormatError.getValueOrThrow<string>(obj, Relation.NAME_KEY);
        let parentModelName = FormatError.getValueOrThrow<string>(obj, Relation.PARENT_MODEL_NAME_KEY);
        let parentFieldName = FormatError.getValueOrThrow<string>(obj, Relation.PARENT_FIELD_NAME_KEY);
        let childModelName = FormatError.getValueOrThrow<string>(obj, Relation.CHILD_MODEL_NAME_KEY);
        let childFieldName = FormatError.getValueOrThrow<string>(obj, Relation.CHILD_FIELD_NAME_KEY);
        let cascadeUpdate = FormatError.getValueOrThrow<boolean>(obj, Relation.CASCADE_UPDATE_KEY);
        let cascadeDelete = FormatError.getValueOrThrow<boolean>(obj, Relation.CASCADE_DELETE_KEY);

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
        let obj : {[k: string]: any} = {};

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