export class BaseArray<T> extends Array<T> {
    constructor(...items : T[]) {
        super(...items);
    }

    /**
     * Removes the given item from an array.
     * @param item 
     * @returns {T} The removed item
     */
    remove(item : T): T | null {
        let index = this.findIndex(i => i == item);
        if (index < 0) return null;
        return this.removeByIndex(index);
    }

    /**
     * Removes item based on the given index.
     * @param index 
     * @returns {T} The removed item
     */
    removeByIndex(index : number) : T {
        let removedItem = this.splice(index, 1)[0];
        return removedItem;
    }
}