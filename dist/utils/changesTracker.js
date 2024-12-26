"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeItem = exports.ChangesTracker = void 0;
const fieldValue_1 = require("../fieldValue");
const errors_1 = require("./errors");
class ChangesTracker {
    constructor(record) {
        this._onChangeMode = false;
        this._changes = [];
        this._record = record;
    }
    beginChanges() {
        if (this.isOnChangeMode())
            throw new errors_1.AlreadyOnChangeModeError(this._record);
        this._onChangeMode = true;
    }
    endChanges() {
        if (!this.isOnChangeMode())
            throw new errors_1.NotOnChangeModeError(this._record);
        this._onChangeMode = false;
        this.clearChanges();
    }
    cancelChanges() {
        if (!this.isOnChangeMode())
            throw new errors_1.NotOnChangeModeError(this._record);
        for (let change of this._changes) {
            change.fieldValue.value = change.oldValue;
        }
        this._onChangeMode = false;
        this.clearChanges();
    }
    isOnChangeMode() {
        return this._onChangeMode;
    }
    pushChange(fieldValue, value) {
        let item = this._changes.find(change => change.fieldValue == fieldValue);
        if (item == null) {
            item = new ChangeItem(fieldValue, value);
            this._changes.push(item);
        }
        else {
            item.newValue = value;
        }
    }
    clearChanges() {
        this._changes = [];
    }
}
exports.ChangesTracker = ChangesTracker;
class ChangeItem {
    constructor(fieldValue, value) {
        this._fieldValue = fieldValue;
        this._oldValue = fieldValue.getValue(fieldValue_1.FieldValueVersion.ORIGINAL);
        this._newValue = value;
    }
    get fieldValue() {
        return this._fieldValue;
    }
    get field() {
        return this._fieldValue.field;
    }
    get oldValue() {
        return this._oldValue;
    }
    get newValue() {
        return this._newValue;
    }
    set newValue(value) {
        this._newValue = value;
    }
}
exports.ChangeItem = ChangeItem;
