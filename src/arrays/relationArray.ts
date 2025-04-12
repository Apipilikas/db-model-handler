import { Model } from "../model";
import { Relation } from "../relation";
import { Schema } from "../schema";
import { BaseArray } from "./baseArray";

export class BaseRelationArray extends BaseArray<Relation> {
    removeByRelationName(relationName : string) {
        let index = this.findIndexByRelationName(relationName);
        return super.removeByIndex(index);
    }

    findIndexByRelationName(relationName : string) {
        return this.findIndex(relation => relation.relationName == relationName);
    }
    
    findByRelationName(relationName : string) {
        return this.find(relation => relation.relationName == relationName);
    }

    findByParentFieldName(fieldName : string) {
        return this.find(relation => relation.parentField.fieldName == fieldName);
    }

    findByChildFieldName(fieldName : string) {
        return this.find(relation => relation.childField.fieldName == fieldName);
    }

    filterByParentFieldName(fieldName : string) {
        return this.filter(relation => relation.parentField.fieldName == fieldName);
    }

    filterByChildFieldName(fieldName : string) {
        return this.filter(relation => relation.childField.fieldName == fieldName);
    }

    findCascadeUpdatedOnes() {
        return this.filter(relation => relation.cascadeUpdate);
    }

    findCascadeDeletedOnes() {
        return this.filter(relation => relation.cascadeDelete)
    }
}

export class RelationArray extends BaseRelationArray {
    private _schema : Schema;

    constructor(schema : Schema) {
        super();
        this._schema = schema;
    }

    push(...items: Relation[]): number {
        items.forEach(item => {
            item.parentModel.childRelations.push(item);
            item.childModel.parentRelations.push(item);
        });

        return super.push(...items);
    }
}

export class RelationModelArray extends BaseRelationArray {
    private _model : Model;
    private _parentRelation : Boolean;

    constructor(model : Model, parentRelation : boolean) {
        super();
        this._model = model;
        this._parentRelation = parentRelation;
    }

    push(...items: Relation[]): number {
        items.forEach(item => {
            if (this._parentRelation) {
                if (item.childModel != this._model) {
                    throw new Error("Mismatch");
                }
            }
            else {
                if (item.parentModel != this._model) {
                    throw new Error("Mismatch");
                }
            }
        });

        return super.push(...items);
    }
}