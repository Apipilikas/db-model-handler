import { FieldValue } from "../fieldValue";
import { BaseArray } from "./baseArray";

export class FieldValueArray extends BaseArray<FieldValue> {
    findByFieldName(fieldName : string) : FieldValue {
        return this.strictFind(fieldValue => fieldValue.fieldName == fieldName, null, `No field found with name ${fieldName}`);
    }
}