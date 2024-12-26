import { FieldValueVersion } from "./fieldValue";
import { Model } from "./model";
import { Relation } from "./relation";
export declare const enum RecordState {
    UNMODIFIED = 0,
    ADDED = 1,
    MODIFIED = 2,
    DELETED = 3,
    DETACHED = 4
}
export declare class Record {
    static STATE_KEY: string;
    static ORIGINAL_VALUES_KEY: string;
    static CURRENT_VALUES_KEY: string;
    static VALUES_KEY: string;
    static CHILD_VALUES_KEY: string;
    static PARENT_VALUE_KEY: string;
    static CHILD_MODEL_NAME_KEY: string;
    static CHILD_FIELD_NAME_KEY: string;
    static CHILD_MODEL_PRIMARY_KEY_VALUES_KEY: string;
    private _model;
    private _state;
    private _fieldValues;
    private _properties;
    private _origin;
    private _changesTracker;
    /**
     * @constructor Record contructor
     * @param model The model
     */
    protected constructor(model: Model);
    get model(): Model;
    get state(): RecordState;
    get properties(): Map<any, any>;
    /**
     * Creates a new Record instance.
     * @param model The model
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     * @returns
     */
    static new(model: Model, ...values: any[]): Record;
    /**
     * Creates a Record instance and loads values into record.
     * @param model The model
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     * @returns
     */
    static loadData(model: Model, ...values: any[]): Record;
    /**
     * Copies a Record into a new one preserving its behavior.
     * @param model The model
     * @param record The record to be copied
     * @returns The copied Record
     */
    static copy(model: Model, record: Record): Record;
    /**
     * Deserializes the JSON object into Record.
     * @param model The model
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * @example
     * {
     *   "state": 0,
     *   "original": {
     *     "field1Name": "value1",
     *     "field2Name": 2
     *   },
     *   "current": {
     *     "field1Name": "value1_modified",
     *     "field2Name": 3
     *   }
     * }
     */
    static deserialize(model: Model, obj: any): Record;
    /**
     * Gets values list in correct order based on fields.
     * @param model The model
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * The object should have fields that belongs to model fields.
     * @returns List of values in correct order that corresponds to fields order. For the fields that were not
     * included in JSON object, default value is taken instead.
     */
    static getCorrectValuesOrderList(model: Model, obj: any): any[];
    /**
     * Gets field's value.
     * @param fieldName The field name
     * @param version The field value version
     */
    getValue(fieldName: string, version?: FieldValueVersion): any;
    /**
     * Sets field's value.
     * @param fieldName The field name
     * @param value The proposed value
     */
    setValue(fieldName: string, value: any): void;
    private setFieldValue;
    private initFieldValues;
    private loadFirstData;
    /**
     * Sets multiple values.
     * @param values Param array of values. Values order should correspond to the fields order.
     * Undefined can be used to skip value.
     */
    loadData(...values: any[]): void;
    /**
     * Deletes record.
     * @throws Error in DELETED and DETACHED state
     */
    delete(): void;
    private shouldDeleteRecord;
    private deleteCascadeChildRecords;
    private updateCascadeChildRecords;
    private remove;
    /**
     * Shows whether record has changes or not.
     */
    hasChanges(): boolean;
    private hasStrictChanges;
    /**
     * Commits all changes.
     */
    acceptChanges(): void;
    /**
     * Rolls back all changes.
     */
    rejectChanges(): void;
    beginChanges(): void;
    endChanges(): void;
    cancelChanges(): void;
    private getChangesByNonStoredFields;
    /**
     * Gets all changes into JSON format.
     */
    getChanges(): {
        [k: string]: any;
    };
    /**
     * Gets all changes excluding non stored fields into JSON format.
     */
    getChangesForSave(): {
        [k: string]: any;
    };
    /**
     * Gets parent record based on given relation name and field value version.
     * @param relationName The relation name of relation
     * @param version The field value version
     */
    getParentRecord(relationName: string, version?: FieldValueVersion): Record | null;
    /**
     * Gets child records based on given relation name.
     * @param relationName The relation name of relation
     */
    getChildRecords(relationName: string): Record[] | null;
    /**
     * Gets child records based on given relation and field value version.
     * @param relation The relation
     */
    getChildRecordsByRelation(relation: Relation, version?: FieldValueVersion): Record[];
    private getChildRecordsByValue;
    /**
     * Gets primary key values.
     */
    getPrimaryKeyValue(): any[];
    /**
     * Adds property to record.
     * @param key The key
     * @param value The value
     */
    addProperty(key: string, value: any): void;
    /**
     * Contains property.
     * @param key The key
     */
    containsProperty(key: string): boolean;
    /**
     * Remove property from record.
     * @param key The key
     */
    removeProperty(key: string): boolean;
    /**
     * Gets property from given key.
     * @param key The key
     */
    getProperty(key: string): any;
    private serializeByVersion;
    private serializeChanges;
    /**
     * Serializes record values into JSON format.
     */
    serialize(): {
        [k: string]: any;
    };
    /**
     * Serializes current record values into JSON format. If record is DELETED, original values are returned instead.
     */
    serializeForDisplay(): {
        [k: string]: any;
    };
    /**
     * Merges record into this one.
     * @param record The record to be merged
     */
    merge(record: Record): void;
    /**
     * Merges json object into this one.
     * @param obj The JSON format object. If the input is string then it will be JSON parsed.
     * The object should have fields that belongs to model fields.
     */
    mergeBySerialization(obj: any): void;
    private mergeChanges;
}
//# sourceMappingURL=record.d.ts.map