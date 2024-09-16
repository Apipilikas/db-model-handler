"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordArray = void 0;
const fieldValue_1 = require("../fieldValue");
const errors_1 = require("../utils/errors");
const baseArray_1 = require("./baseArray");
class RecordArray extends baseArray_1.BaseArray {
    constructor(model) {
        super();
        this._model = model;
    }
    push(...items) {
        let records = []; // Transactional safe
        items.forEach(item => {
            if (this.isRecordUnique(item, records)) {
                records.push(item);
            }
            else
                throw new errors_1.DuplicateRecordError(item);
        });
        records.forEach(record => {
            record.setStateOnPush();
            super.push(record);
        });
        return this.length;
    }
    isRecordUnique(record, addedRecords) {
        let primaryKeys = this._model.getPrimaryKeys();
        let records = [...this._model.records, ...addedRecords];
        for (let rec of records) {
            let matchingCount = 0;
            for (let pk of primaryKeys) {
                if (this.getRecordValue(rec, pk) == this.getRecordValue(record, pk))
                    matchingCount++;
            }
            if (matchingCount == primaryKeys.length) {
                return false;
            }
        }
        return true;
    }
    getRecordValue(record, fieldName) {
        let value;
        if (record.state == 3 /* RecordState.DELETED */) {
            value = record.getValue(fieldName, fieldValue_1.FieldValueVersion.ORIGINAL);
        }
        else {
            value = record.getValue(fieldName);
        }
        return value;
    }
}
exports.RecordArray = RecordArray;
