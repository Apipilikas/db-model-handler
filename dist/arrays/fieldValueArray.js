"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldValueArray = void 0;
const baseArray_1 = require("./baseArray");
class FieldValueArray extends baseArray_1.BaseArray {
    findByFieldName(fieldName) {
        return this.strictFind(fieldValue => fieldValue.fieldName == fieldName, null, `No field found with name ${fieldName}`);
    }
}
exports.FieldValueArray = FieldValueArray;
