import { FieldValueVersion } from "./fieldValue";
import { Model } from "./model";
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
    private _model;
    private _state;
    private _fieldValues;
    private _properties;
    private _origin;
    protected constructor(model: Model);
    get model(): Model;
    get state(): RecordState;
    get properties(): Map<any, any>;
    static new(model: Model, ...values: any[]): Record;
    static loadData(model: Model, ...values: any[]): Record;
    static copy(model: Model, record: Record): Record;
    static deserialize(model: Model, obj: any): Record;
    static getCorrectValuesOrderList(model: Model, obj: any): any[];
    getValue(fieldName: string, version?: FieldValueVersion): any;
    setValue(fieldName: string, value: any): void;
    private initFieldValues;
    private loadFirstData;
    loadData(...values: any[]): void;
    delete(): void;
    private remove;
    hasChanges(): boolean;
    private hasStrictChanges;
    acceptChanges(): void;
    rejectChanges(): void;
    private getChangesByNonStoredFields;
    getChanges(): {
        [k: string]: any;
    };
    getChangesForSave(): {
        [k: string]: any;
    };
    getParentRecord(relationName: string): Record | null;
    getChildRecords(relationName: string): Record[] | null;
    addProperty(key: string, value: any): void;
    containsProperty(key: string): boolean;
    removeProperty(key: string): boolean;
    getProperty(key: string): any;
    private serializeByVersion;
    private serializeChanges;
    serialize(): {
        [k: string]: any;
    };
}
//# sourceMappingURL=record.d.ts.map