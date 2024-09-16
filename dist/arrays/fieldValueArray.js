"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldValueArray = void 0;
const baseArray_1 = require("./baseArray");
class FieldValueArray extends baseArray_1.BaseArray {
    findByFieldName(fieldName) {
        let fldValue = this.find(fieldValue => fieldValue.fieldName == fieldName);
        if (fldValue == null)
            throw new Error(`No field found with name ${fieldName}`);
        return fldValue;
    }
}
exports.FieldValueArray = FieldValueArray;
