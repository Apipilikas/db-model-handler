import { Record } from "..";
import { FieldValue, FieldValueVersion } from "../fieldValue"
import { AlreadyOnChangeModeError, NotOnChangeModeError } from "./errors";

export class ChangesTracker {
    private _record : Record;
    private _onChangeMode : boolean = false;
    private _changes : ChangeItem[] = [];
    
    constructor(record : Record) {
        this._record = record;
    }

    beginChanges() {
        if (this.isOnChangeMode()) throw new AlreadyOnChangeModeError(this._record);

        this._onChangeMode = true;
    }

    endChanges() {
        if (!this.isOnChangeMode()) throw new NotOnChangeModeError(this._record);

        this._onChangeMode = false;
        this.clearChanges();
    }

    cancelChanges() {
        if (!this.isOnChangeMode()) throw new NotOnChangeModeError(this._record);
        
        for (let change of this._changes) {
            change.fieldValue.value = change.oldValue;
        }

        this._onChangeMode = false;
        this.clearChanges();
    }

    isOnChangeMode() {
        return this._onChangeMode;
    }

    pushChange(fieldValue : FieldValue, value : any) {
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

export class ChangeItem {
    private _fieldValue : FieldValue;
    private _oldValue : any;
    private _newValue : any;

    constructor(fieldValue : FieldValue, value : any) {
        this._fieldValue = fieldValue;
        this._oldValue = fieldValue.getValue(FieldValueVersion.ORIGINAL);
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

    set newValue(value : any) {
        this._newValue = value;
    }
}