"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseArray = void 0;
class BaseArray extends Array {
    constructor(...items) {
        super(...items);
    }
    /**
     * Removes the given item from an array.
     * @param item
     * @returns {T} The removed item
     */
    remove(item) {
        let index = this.findIndex(i => i == item);
        if (index < 0)
            return null;
        return this.removeByIndex(index);
    }
    /**
     * Removes item based on the given index.
     * @param index
     * @returns {T} The removed item
     */
    removeByIndex(index) {
        let removedItem = this.splice(index, 1)[0];
        return removedItem;
    }
    clear() {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            this.pop();
        }
    }
}
exports.BaseArray = BaseArray;
