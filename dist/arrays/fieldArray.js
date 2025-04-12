"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldArray = void 0;
const errors_1 = require("../utils/errors");
const baseArray_1 = require("./baseArray");
class FieldArray extends baseArray_1.BaseArray {
    constructor(model) {
        super();
        this._model = model;
    }
    push(...items) {
        if (this._model.isInitialized)
            throw new errors_1.AlreadyInitializedModelError(this._model.modelName);
        items.forEach(item => item.setModel(this._model));
        return super.push(...items);
    }
    removeByFieldName(fieldName) {
        let index = this.findIndex(field => field.fieldName == fieldName);
        return this.removeByIndex(index);
    }
    findByFieldName(fieldName) {
        let fld = this.find(field => field.fieldName == fieldName);
        if (fld == null)
            throw new errors_1.FieldNotFoundError(fieldName, this._model.modelName);
        return fld;
    }
}
exports.FieldArray = FieldArray;
