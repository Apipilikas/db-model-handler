"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelArray = void 0;
const errors_1 = require("../utils/errors");
const baseArray_1 = require("./baseArray");
class ModelArray extends baseArray_1.BaseArray {
    constructor(schema) {
        super();
        this._schema = schema;
    }
    push(...items) {
        if (this._schema.isInitialized)
            throw new errors_1.AlreadyInitializedSchemaError(this._schema.schemaName);
        items.forEach(item => item.setSchema(this._schema));
        return super.push(...items);
    }
    findByModelName(modelName) {
        return this.strictFind(model => model.modelName == modelName, null, `No model found with name ${modelName}`);
        ;
    }
    contains(modelName) {
        let model = this.find(model => model.modelName == modelName);
        return model != null;
    }
}
exports.ModelArray = ModelArray;
