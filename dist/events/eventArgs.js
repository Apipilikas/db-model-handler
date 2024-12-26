"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordDeletedEventArgs = exports.RecordDeletingEventArgs = exports.ValueChangeEventArgs = void 0;
class EventArgs {
}
class ValueChangeEventArgs extends EventArgs {
    constructor(field, record, previousValue, proposedValue) {
        super();
        this.field = field;
        this.record = record;
        this.previousValue = previousValue;
        this.proposedValue = proposedValue;
    }
}
exports.ValueChangeEventArgs = ValueChangeEventArgs;
class RecordDeletingEventArgs extends EventArgs {
    constructor(record) {
        super();
        this.record = record;
        this.cancel = false;
    }
}
exports.RecordDeletingEventArgs = RecordDeletingEventArgs;
class RecordDeletedEventArgs extends EventArgs {
    constructor(record) {
        super();
        this.record = record;
    }
}
exports.RecordDeletedEventArgs = RecordDeletedEventArgs;
