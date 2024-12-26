export class BaseArray<T> extends Array<T> {
    constructor(...items : T[]) {
        super(...items);
    }

    /**
     * Returns the value of the first element in the array where predicate is true. Otherwise, throws error.
     * @param predicate find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. 
     * If such an element is found, find immediately returns that element value. Otherwise, find returns undefined. 
     * @param thisArg If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
     * @param errorMessage If provided and predicate isn't true, throws error with the specified message.
     * @returns 
     */
    strictFind(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any, errorMessage? : string): T {
        let item = this.find(predicate, thisArg);

        if (item == null) {
            let message = errorMessage == null ? `Item was not found in Array [${this.constructor.name}]` : errorMessage;
            throw new Error(message);
        } 

        return item;
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

    /**
     * Clears array from items.
     */
    clear() {
        let length = this.length
        for (let i = 0; i < length; i++) {
            this.pop();
        }
    }
}