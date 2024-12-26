import { FieldArray } from "./arrays/fieldArray";
import { RecordArray } from "./arrays/recordArray";
import { RelationModelArray } from "./arrays/relationArray";
import { Field } from "./field";
import { Record } from "./record";
import { Schema } from "./schema";
import { DataType } from "./utils/dataTypeValidator";
import { IMHEvent } from "./events/events";
export declare class Model {
    static NAME_KEY: string;
    static FIELDS_KEY: string;
    static RECORDS_KEY: string;
    private _modelName;
    private _fields;
    private _records;
    private _schema;
    private _parentRelations;
    private _childRelations;
    private _primaryKey;
    private _isInitialized;
    strictMode: boolean;
    private _valueChanging;
    private _valueChanged;
    private _recordDeleting;
    private _recordDeleted;
    /**
     * @constructor Model constructor
     * @param modelName The model name
     */
    constructor(modelName: string);
    get modelName(): string;
    get fields(): FieldArray;
    get records(): RecordArray;
    get schema(): Schema;
    get parentRelations(): RelationModelArray;
    get childRelations(): RelationModelArray;
    get primaryKey(): Field[];
    get valueChanging(): IMHEvent;
    get valueChanged(): IMHEvent;
    get recordDeleting(): IMHEvent;
    get recordDeleted(): IMHEvent;
    /**
     * Deserializes JSON format object into Model instance.
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * @example
     * {
     *   "modelName": "modelName",
     *   "fields": [
     *     {
     *       "fieldName": "field1Name",
     *       "dataType": "string",
     *       "primaryKey": true,
     *       "readOnly": true,
     *       "nonStored": false
     *     }
     *   ]
     * }
     */
    static deserializeStructure(obj: any): Model;
    /**
     * Initializes the model. Fields should be initialized here.
     */
    initModel(): void;
    private initPrimaryKey;
    /**
     * Pushes new field into the FieldArray.
     * @param name The field name
     * @param dataType The data type
     * @param readOnly Declares whether field is readonly or not.
     * @param primaryKey Declares whether field is primary key or not.
     * @returns The pushed field
     */
    pushNewField(name: string, dataType: string | any | DataType, readOnly: boolean, primaryKey: boolean): Field;
    /**
     * Pushes new record into the RecordArray.
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     */
    pushNewRecord(...values: any[]): Record;
    /**
     * Loads data into record.
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     */
    loadRecord(...values: any[]): Record;
    /**
     * Shows whether records have changes or not.
     */
    hasChanges(): boolean;
    /**
     * Commits changes to all records.
     */
    acceptChanges(): void;
    /**
     * Rolls back changes in every record.
     */
    rejectChanges(): void;
    private getChangesBySave;
    /**
     * Gets changes of each record into JSON format.
     */
    getChanges(): any[];
    /**
     * Gets changes of each record excluding non stored fields into JSON format.
     */
    getChangesForSave(): any[];
    /**
     * Merges model into this one.
     * @param model The model to be merged
     */
    merge(model: Model): void;
    /**
     * Serializes every record of the model into JSON format.
     */
    serialize(): {
        [k: string]: any;
    };
    /**
     * Serializes only the important information of every record of the model into JSON format.
     */
    serializeForDisplay(): any[];
    /**
     * Deserializes the JSON object into model records.
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * @example
     * {
     *   "records": [
     *     {
     *       "state": 0,
     *       "original": {
     *         "field1Name": "value1",
     *         "field2Name": 2
     *       },
     *       "current": {
     *         "field1Name": "value1_modified",
     *         "field2Name": 3
     *       }
     *     }
     *   ]
     * }
     */
    deserialize(obj: any): void;
    /**
     * Serializes Model structure into JSON format.
     */
    serializeStructure(): {
        [k: string]: any;
    };
    /**
     * Gets record based on the given filter.
     * @param filter The filter expression
     */
    select(filter: string): Record[];
    /**
     * Gets primary key field names.
     */
    getPrimaryKeyName(): string[];
    containsFieldValue(fieldName: string, value: any): boolean;
}
//# sourceMappingURL=model.d.ts.map