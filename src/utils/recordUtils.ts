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

    public static hasSamePrimaryKey(record : Record, comparedRecord : Record) {
        let primaryKeys = record.model.getPrimaryKeyName();

        let matchingCount = 0;
        for (let pk of primaryKeys) {
            if (this.getRecordValue(record, pk) == this.getRecordValue(comparedRecord, pk)) matchingCount ++;
        }

        if (matchingCount == primaryKeys.length) {
            return true;
        }

        return false;
    }
}

module.exports = {RecordUtils};