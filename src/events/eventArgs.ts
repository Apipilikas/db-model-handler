import { Field, Record } from "..";

class EventArgs {

}

export class ValueChangeEventArgs extends EventArgs {
    public readonly field : Field
    public readonly record : Record
    public previousValue : any
    public proposedValue : any

    constructor(field : Field, record : Record, previousValue : any, proposedValue : any) {
        super();

        this.field = field;
        this.record = record;
        this.previousValue = previousValue;
        this.proposedValue = proposedValue;
    }
}

export class RecordDeletingEventArgs extends EventArgs {
    public readonly record : Record
    public cancel : boolean

    constructor(record : Record) {
        super();

        this.record = record;
        this.cancel = false;
    }
}

export class RecordDeletedEventArgs extends EventArgs {
    public readonly record : Record

    constructor(record : Record) {
        super();

        this.record = record;
    }
}