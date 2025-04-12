import { RecordDeletedEventArgs, RecordDeletingEventArgs, ValueChangeEventArgs } from "../events/eventArgs";
export interface IMHEvent {
    name: string;
    addListener(listener: Function): void;
    removeListener(listener: Function): void;
}
export declare class MHEvent implements IMHEvent {
    name: string;
    protected listeners: Function[];
    constructor(name: string);
    addListener(listener: Function): void;
    raiseEvent(sender: object, ...args: any[]): void;
    removeListener(listener: Function): void;
}
export declare class ValueChangingEvent extends MHEvent {
    constructor();
    raiseEvent(sender: object, arg: ValueChangeEventArgs): void;
}
export declare class ValueChangedEvent extends MHEvent {
    constructor();
    raiseEvent(sender: object, arg: ValueChangeEventArgs): void;
}
export declare class RecordDeletingEvent extends MHEvent {
    constructor();
    raiseEvent(sender: object, arg: RecordDeletingEventArgs): void;
}
export declare class RecordDeletedEvent extends MHEvent {
    constructor();
    raiseEvent(sender: object, arg: RecordDeletedEventArgs): void;
}
//# sourceMappingURL=events.d.ts.map