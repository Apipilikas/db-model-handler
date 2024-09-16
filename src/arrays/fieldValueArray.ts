import { FieldValue } from "../fieldValue";
import { BaseArray } from "./baseArray";

export class FieldValueArray extends BaseArray<FieldValue> {
    findByFieldName(fieldName : string) {
        let fldValue = this.find(fieldValue => fieldValue.fieldName == fieldName);

        if (fldValue == null) throw new Error(`No field found with name ${fieldName}`);

        return fldValue;
    }
}