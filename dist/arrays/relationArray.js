"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationModelArray = exports.RelationArray = exports.BaseRelationArray = void 0;
const baseArray_1 = require("./baseArray");
class BaseRelationArray extends baseArray_1.BaseArray {
    removeByRelationName(relationName) {
        let index = this.findIndexByRelationName(relationName);
        return super.removeByIndex(index);
    }
    findIndexByRelationName(relationName) {
        return this.findIndex(relation => relation.relationName == relationName);
    }
    findByRelationName(relationName) {
        return this.find(relation => relation.relationName == relationName);
    }
    findByParentFieldName(fieldName) {
        return this.find(relation => relation.parentField.fieldName == fieldName);
    }
    findByChildFieldName(fieldName) {
        return this.find(relation => relation.childField.fieldName == fieldName);
    }
    filterByParentFieldName(fieldName) {
        return this.filter(relation => relation.parentField.fieldName == fieldName);
    }
    filterByChildFieldName(fieldName) {
        return this.filter(relation => relation.childField.fieldName == fieldName);
    }
    findCascadeUpdatedOnes() {
        return this.filter(relation => relation.cascadeUpdate);
    }
    findCascadeDeletedOnes() {
        return this.filter(relation => relation.cascadeDelete);
    }
}
exports.BaseRelationArray = BaseRelationArray;
class RelationArray extends BaseRelationArray {
    constructor(schema) {
        super();
        this._schema = schema;
    }
    push(...items) {
        items.forEach(item => {
            item.parentModel.childRelations.push(item);
            item.childModel.parentRelations.push(item);
        });
        return super.push(...items);
    }
}
exports.RelationArray = RelationArray;
class RelationModelArray extends BaseRelationArray {
    constructor(model, parentRelation) {
        super();
        this._model = model;
        this._parentRelation = parentRelation;
    }
    push(...items) {
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
exports.RelationModelArray = RelationModelArray;
