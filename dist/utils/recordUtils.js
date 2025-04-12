"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordUtils = void 0;
const __1 = require("..");
class RecordUtils {
    static getRecordValue(record, fieldName) {
        let value;
        if (record.state == 3 /* RecordState.DELETED */) {
            value = record.getValue(fieldName, __1.FieldValueVersion.ORIGINAL);
        }
        else {
            value = record.getValue(fieldName);
        }
        return value;
    }
    static hasSamePrimaryKey(record, comparedRecord) {
        let primaryKeys = record.model.getPrimaryKeyName();
        let matchingCount = 0;
        for (let pk of primaryKeys) {
            if (this.getRecordValue(record, pk) == this.getRecordValue(comparedRecord, pk))
                matchingCount++;
        }
        if (matchingCount == primaryKeys.length) {
            return true;
        }
        return false;
    }
}
exports.RecordUtils = RecordUtils;
module.exports = { RecordUtils };
