import { RecordUtils } from "../utils/recordUtils";
import { Model } from "../model";
import { Record } from "../record";
import { StringValidator } from "../utils/dataTypeValidator";
import { DuplicateRecordError } from "../utils/errors";
import { BaseArray } from "./baseArray";

export class RecordArray extends BaseArray<Record> {
    private _model : Model;

    constructor(model : Model) {
        super();
        this._model = model;
    }

    push(...items: Record[]): number {
        let records : Record[] = []; // Transactional safe

        items.forEach(item => {
            if (this.isRecordUnique(item, records)) {
                records.push(item);
            }
            else throw new DuplicateRecordError(item);
        });

        records.forEach(record => {
            record.setStateOnPush();
            super.push(record);
        });

        return this.length;
    }

    findByPrimaryKey(...values : any[]) {
        let primaryKeys = this._model.getPrimaryKeyName().sort((a, b) => a > b ? 1 : -1);
        let filter : string = StringValidator.empty;
        for (let i = 0; i < primaryKeys.length; i++) {
            if (i > 0) filter += " and ";

            filter += `${primaryKeys[i]} = '${values[i]}'`;
        }

        let records = this._model.select(filter);

        if (records.length == 0) return null;
        if (records.length > 1) throw new Error("PRIMARY KEY VIOLATION");

        return records[0];
    }

    findByFieldName(fieldName : string, value : any) {
        return this.find(record => RecordUtils.getRecordValue(record, fieldName) == value);
    }

    private isRecordUnique(record : Record, addedRecords : Record[]) {
        let records = [...this._model.records, ...addedRecords]

        for (let rec of records) {
            if (RecordUtils.hasSamePrimaryKey(rec, record)) return false;
        }

        return true;
    }
}