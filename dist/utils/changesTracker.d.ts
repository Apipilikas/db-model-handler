import { Record } from "..";
import { FieldValue } from "../fieldValue";
export declare class ChangesTracker {
    private _record;
    private _onChangeMode;
    private _changes;
    constructor(record: Record);
    beginChanges(): void;
    endChanges(): void;
    cancelChanges(): void;
    isOnChangeMode(): boolean;
    pushChange(fieldValue: FieldValue, value: any): void;
    clearChanges(): void;
}
export declare class ChangeItem {
    private _fieldValue;
    private _oldValue;
    private _newValue;
    constructor(fieldValue: FieldValue, value: any);
    get fieldValue(): FieldValue;
    get field(): import("..").Field;
    get oldValue(): any;
    get newValue(): any;
    set newValue(value: any);
}
//# sourceMappingURL=changesTracker.d.ts.map