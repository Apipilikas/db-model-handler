import { Field } from "../field";
import { Model } from "../model";
import { AlreadyInitializedModelError, FieldNotFoundError } from "../utils/errors";
import { BaseArray } from "./baseArray";

export class FieldArray extends BaseArray<Field> {
    private _model : Model;

    constructor(model : Model) {
        super();
        this._model = model;
    }

    push(...items: Field[]): number {
        if (this._model.isInitialized) throw new AlreadyInitializedModelError(this._model.modelName);

        items.forEach(item => item.setModel(this._model));
        return super.push(...items);
    }

    removeByFieldName(fieldName : string) {
        let index = this.findIndex(field => field.fieldName == fieldName);
        return this.removeByIndex(index);
    }

    findByFieldName(fieldName : string) {
        let fld = this.find(field => field.fieldName == fieldName);

        if (fld == null) throw new FieldNotFoundError(fieldName, this._model.modelName);

        return fld;
    }
}