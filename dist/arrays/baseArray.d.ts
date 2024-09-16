export declare class BaseArray<T> extends Array<T> {
    constructor(...items: T[]);
    /**
     * Removes the given item from an array.
     * @param item
     * @returns {T} The removed item
     */
    remove(item: T): T | null;
    /**
     * Removes item based on the given index.
     * @param index
     * @returns {T} The removed item
     */
    removeByIndex(index: number): T;
}
//# sourceMappingURL=baseArray.d.ts.map