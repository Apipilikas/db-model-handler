import { RecordDeletedEventArgs, RecordDeletingEventArgs, ValueChangeEventArgs } from "../events/eventArgs";

export interface IMHEvent {
    name : string;

    addListener(listener : Function) : void;
    removeListener(listener : Function) : void;
}

export class MHEvent implements IMHEvent {
    name: string;
    protected listeners: Function[] = [];

    constructor(name : string) {
        this.name = name;
    }

    addListener(listener: Function): void {
        this.listeners.push(listener);
    }

    raiseEvent(sender : object, ...args : any[]) : void {
        this.listeners.forEach(listener => listener.call(sender, ...args));
    }

    removeListener(listener: Function): void {
        let index = this.listeners.indexOf(listener);
        if (index > -1) this.listeners.splice(index, 1);
    }
}

export class ValueChangingEvent extends MHEvent {

    constructor() {
        super("__ValueChanging__");
    }

    override raiseEvent(sender : object, arg: ValueChangeEventArgs): void {
        super.raiseEvent(sender, arg);
    }
}

export class ValueChangedEvent extends MHEvent {

    constructor() {
        super("__ValueChanged__");
    }

    override raiseEvent(sender : object, arg: ValueChangeEventArgs): void {
        super.raiseEvent(sender, arg);
    }
}

export class RecordDeletingEvent extends MHEvent {

    constructor() {
        super("__RecordDeleting__");
    }

    override raiseEvent(sender : object, arg: RecordDeletingEventArgs): void {
        super.raiseEvent(sender, arg);
    }
}

export class RecordDeletedEvent extends MHEvent {

    constructor() {
        super("__RecordDeleted__");
    }

    override raiseEvent(sender : object, arg: RecordDeletedEventArgs): void {
        super.raiseEvent(sender, arg);
    }
}