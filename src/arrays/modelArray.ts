import { Model } from "../model";
import { Schema } from "../schema";
import { AlreadyInitializedSchemaError } from "../utils/errors";
import { BaseArray } from "./baseArray";

export class ModelArray extends BaseArray<Model> {
    private _schema : Schema;

    constructor(schema : Schema) {
        super();
        this._schema = schema;
    }

    push(...items: Model[]): number {
        if (this._schema.isInitialized) throw new AlreadyInitializedSchemaError(this._schema.schemaName);

        items.forEach(item => item.setSchema(this._schema));
        return super.push(...items);
    }

    findByModelName(modelName : string) {
        let model = this.find(model => model.modelName == modelName);

        if (model == null) throw new Error(`No model found with name ${modelName}`);

        return model;
    }

    contains(modelName : string) {
        let model = this.find(model => model.modelName == modelName);
        return model != null;
    }
}