"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordDeletedEvent = exports.RecordDeletingEvent = exports.ValueChangedEvent = exports.ValueChangingEvent = exports.MHEvent = void 0;
class MHEvent {
    constructor(name) {
        this.listeners = [];
        this.name = name;
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    raiseEvent(sender, ...args) {
        this.listeners.forEach(listener => listener.call(sender, ...args));
    }
    removeListener(listener) {
        let index = this.listeners.indexOf(listener);
        if (index > -1)
            this.listeners.splice(index, 1);
    }
}
exports.MHEvent = MHEvent;
class ValueChangingEvent extends MHEvent {
    constructor() {
        super("__ValueChanging__");
    }
    raiseEvent(sender, arg) {
        super.raiseEvent(sender, arg);
    }
}
exports.ValueChangingEvent = ValueChangingEvent;
class ValueChangedEvent extends MHEvent {
    constructor() {
        super("__ValueChanged__");
    }
    raiseEvent(sender, arg) {
        super.raiseEvent(sender, arg);
    }
}
exports.ValueChangedEvent = ValueChangedEvent;
class RecordDeletingEvent extends MHEvent {
    constructor() {
        super("__RecordDeleting__");
    }
    raiseEvent(sender, arg) {
        super.raiseEvent(sender, arg);
    }
}
exports.RecordDeletingEvent = RecordDeletingEvent;
class RecordDeletedEvent extends MHEvent {
    constructor() {
        super("__RecordDeleted__");
    }
    raiseEvent(sender, arg) {
        super.raiseEvent(sender, arg);
    }
}
exports.RecordDeletedEvent = RecordDeletedEvent;
