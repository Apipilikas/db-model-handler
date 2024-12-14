"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordArray = void 0;
const recordUtils_1 = require("../utils/recordUtils");
const dataTypeValidator_1 = require("../utils/dataTypeValidator");
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
    findByPrimaryKey(...values) {
        let primaryKeys = this._model.getPrimaryKeyName().sort((a, b) => a > b ? 1 : -1);
        let filter = dataTypeValidator_1.StringValidator.empty;
        for (let i = 0; i < primaryKeys.length; i++) {
            if (i > 0)
                filter += " and ";
            filter += `${primaryKeys[i]} = '${values[i]}'`;
        }
        let records = this._model.select(filter);
        if (records.length == 0)
            return null;
        if (records.length > 1)
            throw new Error("PRIMARY KEY VIOLATION");
        return records[0];
    }
    findByFieldName(fieldName, value) {
        return this.find(record => recordUtils_1.RecordUtils.getRecordValue(record, fieldName) == value);
    }
    isRecordUnique(record, addedRecords) {
        let records = [...this._model.records, ...addedRecords];
        for (let rec of records) {
            if (recordUtils_1.RecordUtils.hasSamePrimaryKey(rec, record))
                return false;
        }
        return true;
    }
}
exports.RecordArray = RecordArray;
