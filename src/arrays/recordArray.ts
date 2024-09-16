import { FieldValueVersion } from "../fieldValue";
import { Model } from "../model";
import { Record, RecordState } from "../record";
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

    private isRecordUnique(record : Record, addedRecords : Record[]) {
        let primaryKeys = this._model.getPrimaryKeys();
        let records = [...this._model.records, ...addedRecords]

        for (let rec of records) {
            let matchingCount = 0;
            for (let pk of primaryKeys) {
                if (this.getRecordValue(rec, pk) == this.getRecordValue(record, pk)) matchingCount ++;
            }

            if (matchingCount == primaryKeys.length) {
                return false;
            }
        }

        return true;
    }

    private getRecordValue(record : Record, fieldName : string) {
        let value : any;

        if (record.state == RecordState.DELETED) {
            value = record.getValue(fieldName, FieldValueVersion.ORIGINAL);
        }
        else {
            value = record.getValue(fieldName);
        }

        return value;
    }
}