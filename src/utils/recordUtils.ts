import { FieldValueVersion, Record, RecordState } from "..";

export class RecordUtils {
    public static getRecordValue(record : Record, fieldName : string) {
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

module.exports = {RecordUtils};