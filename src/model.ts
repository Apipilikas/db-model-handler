import { FieldArray } from "./arrays/fieldArray";
import { RecordArray } from "./arrays/recordArray";
import { RelationArray, RelationModelArray } from "./arrays/relationArray";
import { Field } from "./field";
import { FieldValueVersion } from "./fieldValue";
import { FilterSelector } from "./filterEvaluator/filterSelector";
import { Record, RecordState } from "./record";
import { Schema } from "./schema";
import { DataType } from "./utils/dataTypeValidator";
import { MergeModelError, NotInitializedModelError, FormatError } from "./utils/errors";


export class Model {
    static NAME_KEY = "name";
    static FIELDS_KEY = "fields";

    private _modelName : string
    private _fields : FieldArray;
    private _records : RecordArray;
    private _schema : Schema;
    private _parentRelations : RelationModelArray;
    private _childRelations : RelationModelArray;
    private _isInitialized : boolean = true;

    constructor(modelName : string) {
        this._modelName = modelName;
        this._fields = new FieldArray(this);
        this._records = new RecordArray(this);
        this._parentRelations = new RelationModelArray(this, true);
        this._childRelations = new RelationModelArray(this, false);

        this.initModel();

        this._isInitialized = false;
    }

    get modelName() : string {
        return this._modelName;
    }

    get fields() : FieldArray {
        return this._fields;
    }

    get records(): RecordArray {
        return this._records;
    }

    get schema() : Schema {
        return this._schema;
    }

    get parentRelations() {
        return this._parentRelations;
    }

    get childRelations() {
        return this._childRelations;
    }

    /**
     * @internal
     */
    get isInitialized() {
        return this._isInitialized;
    }

    static deserializeStructure(obj : any) {
        let modelName = FormatError.getValueOrThrow<string>(obj, Model.NAME_KEY);
        let fields = FormatError.getValueOrThrow<any[]>(obj, Model.FIELDS_KEY);

        let initFun = Model.prototype.initModel;

        Model.prototype.initModel = function() {
            fields.forEach(field => this._fields.push(Field.deserializeStructure(field)));
        }

        let model = new Model(modelName);

        Model.prototype.initModel = initFun;

        return model;
    }

    initModel() {
        throw new NotInitializedModelError(this.modelName);
    }

    pushNewField(name : string, dataType : string | any | DataType, readOnly : boolean, primaryKey : boolean) : Field {
        let field = new Field(name, dataType, readOnly, primaryKey);
        this._fields.push(field);
        return field;
    }

    pushNewRecord(...values : any[]) : Record {
        let record = Record.new(this, ...values);
        this._records.push(record);
        return record;
    }

    loadRecord(...values : any[]) : Record {
        let record = Record.loadData(this, ...values);
        this._records.push(record);
        return record;
    }

    loadRecords(data : any[]) : void {
        for (var obj of data) {
            this.loadRecord(...Object.values(obj));
        }
    }

    hasChanges() : boolean {
        for (var record of this._records) {
            if (record.hasChanges()) return true;
        }

        return false;
    }

    acceptChanges() : void {
        this._records.forEach(record => record.acceptChanges());
    }

    rejectChanges() : void {
        this._records.forEach(record => record.rejectChanges());
    }

    private getChangesBySave(forSave : boolean) {
        let array : any[] = [];
        for (let record of this._records) {
            if (record.state == RecordState.UNMODIFIED) continue;
            
            let obj: {[k: string]: any} = {};
            obj[Record.STATE_KEY] = record.state;
            obj[Record.VALUES_KEY] = (forSave) ? record.getChangesForSave() : record.getChanges();
            
            array.push(obj);
        }

        return array;
    }

    getChanges() {
        return this.getChangesBySave(false);
    }

    getChangesForSave() {
        return this.getChangesBySave(true);
    }

    merge(model : Model) {
        for (let field of this._fields) {
            try {
                model.fields.findByFieldName(field.fieldName)
            }
            catch {
                throw new MergeModelError(model.modelName, this.modelName, field.fieldName);
            }
        }
        
        for (let record of model.records) {
            let copiedRecord = Record.copy(this, record);
            this._records.push(copiedRecord);
        }
    }

    serialize() {
        let array : any[] = [];
        this._records.forEach(record => array.push(record.serialize()));
        return array;
    }

    deserialize(jsonString : string) {
        let parsedJson : any[] = JSON.parse(jsonString);

        for (let obj of parsedJson) {
            let record = Record.deserialize(this, obj);
            this._records.push(record);
        }
    }

    serializeStructure() {
        let obj: {[k: string]: any} = {};
        let fieldsArray : any[] = [];

        this._fields.forEach(field => fieldsArray.push(field.serializeStructure()));

        obj[Model.NAME_KEY] = this._modelName;
        obj[Model.FIELDS_KEY] = fieldsArray;

        return obj;
    }

    select(filter : string) {
        return FilterSelector.getSelectedRecords(filter, this);
    }

    getPrimaryKeys() {
        let array : string[] = [];
        this._fields.forEach(field => {
            if (field.primaryKey) {
                array.push(field.fieldName)
            }
        });
        return array;
    }

    /**
     * 
     * @param schema 
     * @internal
     */
    setSchema(schema : Schema) {
        this._schema = schema;
    }
}