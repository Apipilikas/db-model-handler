"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosingCharNotFoundError = void 0;
class ClosingCharNotFoundError extends Error {
    constructor(str, closingChar) {
        let msg = `Closing char [${closingChar}] not found in given string [${str}]`;
        super(msg);
    }
}
exports.ClosingCharNotFoundError = ClosingCharNotFoundError;
