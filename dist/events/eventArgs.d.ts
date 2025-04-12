import { Field, Record } from "..";
declare class EventArgs {
}
export declare class ValueChangeEventArgs extends EventArgs {
    readonly field: Field;
    readonly record: Record;
    previousValue: any;
    proposedValue: any;
    constructor(field: Field, record: Record, previousValue: any, proposedValue: any);
}
export declare class RecordDeletingEventArgs extends EventArgs {
    readonly record: Record;
    cancel: boolean;
    constructor(record: Record);
}
export declare class RecordDeletedEventArgs extends EventArgs {
    readonly record: Record;
    constructor(record: Record);
}
export {};
//# sourceMappingURL=eventArgs.d.ts.map