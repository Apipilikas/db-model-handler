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
}
exports.RecordUtils = RecordUtils;
module.exports = { RecordUtils };
