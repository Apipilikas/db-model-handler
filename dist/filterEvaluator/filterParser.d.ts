import { FilterOperator, FilterNodeType } from "./filterNode";
export declare class FilterParser {
    private _filter;
    private _filterOperator;
    private _leftFilterExp;
    private _rightFilterExp;
    constructor(filter: string);
    static parse(filter: string): FilterParser;
    get leftFilterExp(): string;
    get rightFilterExp(): string;
    get filterOperator(): FilterOperator;
    getFilterType(): FilterNodeType.EXPRESSION | FilterNodeType.FIELD | FilterNodeType.VALUE;
    parse(): void;
    /**
     * Gets a parsed list based on the given filter.
     * @param filter
     * @returns The parsed list
     */
    private getParsedList;
    static getFilterNodeType(filter: string): FilterNodeType.EXPRESSION | FilterNodeType.FIELD | FilterNodeType.VALUE;
    /**
     * Gets a list with all the items joined into a single item.
     * @param list
     * @returns
     */
    private static joinListItems;
    static replaceChars(str: string, openIndex: number, closeIndex?: number): string;
    static replaceQuotes(str: string, openIndex: number, closeIndex?: number): string;
    /**
     * Finds closing position of a character.
     * @param str
     * @param openingChar
     * @param closingChar
     * @returns
     */
    static findClosingCharPosition(str: string, openingChar: string, closingChar: string, openingCharPosition?: number): number;
    private simplifyParenthesis;
    private simplifyQuotes;
}
//# sourceMappingURL=filterParser.d.ts.map