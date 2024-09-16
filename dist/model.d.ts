import { FieldArray } from "./arrays/fieldArray";
import { RecordArray } from "./arrays/recordArray";
import { RelationModelArray } from "./arrays/relationArray";
import { Field } from "./field";
import { Record } from "./record";
import { Schema } from "./schema";
import { DataType } from "./utils/dataTypeValidator";
export declare class Model {
    static NAME_KEY: string;
    static FIELDS_KEY: string;
    private _modelName;
    private _fields;
    private _records;
    private _schema;
    private _parentRelations;
    private _childRelations;
    private _isInitialized;
    constructor(modelName: string);
    get modelName(): string;
    get fields(): FieldArray;
    get records(): RecordArray;
    get schema(): Schema;
    get parentRelations(): RelationModelArray;
    get childRelations(): RelationModelArray;
    static deserializeStructure(obj: any): Model;
    initModel(): void;
    pushNewField(name: string, dataType: string | any | DataType, readOnly: boolean, primaryKey: boolean): Field;
    pushNewRecord(...values: any[]): Record;
    loadRecord(...values: any[]): Record;
    loadRecords(data: any[]): void;
    hasChanges(): boolean;
    acceptChanges(): void;
    rejectChanges(): void;
    private getChangesBySave;
    getChanges(): any[];
    getChangesForSave(): any[];
    merge(model: Model): void;
    serialize(): any[];
    deserialize(jsonString: string): void;
    serializeStructure(): {
        [k: string]: any;
    };
    select(filter: string): Record[];
    getPrimaryKeys(): string[];
}
//# sourceMappingURL=model.d.ts.map