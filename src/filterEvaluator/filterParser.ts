import { DataTypeValidator, NumberValidator } from "../utils/dataTypeValidator";
import { ClosingCharNotFoundError } from "../utils/errors";
import { FilterOperator, FilterOperatorUtils, FilterNodeType } from "./filterNode";

export class FilterParser {
    private _filter : string;
    private _filterOperator : FilterOperator;
    private _leftFilterExp : string = "";
    private _rightFilterExp : string = "";

    constructor(filter : string) {
        this._filter = filter;
        this._filterOperator = FilterOperator.NONE;
    }

    static parse(filter : string) {
        let parser = new FilterParser(filter);
        parser.parse();
        return parser;
    }

    get leftFilterExp() {
        return this._leftFilterExp;
    }

    get rightFilterExp() {
        return this._rightFilterExp;
    }

    get filterOperator() {
        return this._filterOperator;
    }

    getFilterType() {
        return FilterParser.getFilterNodeType(this._filter);
    }

    parse() {
        let parsedList = this.getParsedList(this._filter);
        
        if (parsedList.length == 3) {
            this._leftFilterExp = parsedList[0];
            this._filterOperator = FilterOperatorUtils.getFilterOperator(parsedList[1]);
            this._rightFilterExp = parsedList[2];
        }
        else if (parsedList.length == 2 && FilterOperatorUtils.isFilterOperator(parsedList[0], FilterOperator.NOT)) {
            this._filterOperator = FilterOperatorUtils.getFilterOperator(parsedList[0]);
            this._rightFilterExp = parsedList[1];
        }
        else {
            throw new Error("Error in filter parsing");
        }
    }

    /**
     * Gets a parsed list based on the given filter.
     * @param filter 
     * @returns The parsed list
     */
    private getParsedList(filter : string) : string[] {
        let list : string[] = [];
        let breakFor = false;
        let str = "";

    for (let i = 0; i < filter.length; i++) {
            let char = filter[i];
            
            if (char == " ") {
                switch (FilterOperatorUtils.getFilterOperator(str)) {
                    case FilterOperator.IN:
                    case FilterOperator.NOT:
                    case FilterOperator.AND:
                    case FilterOperator.OR:
                        list = FilterParser.joinListItems(list);
                        list.push(str);
        
                        // rest string
                        str = filter.substring(i + 1); // +1 for the last char of operator
                        breakFor = true;
                        break;
                }

                list.push(str);
                str = "";
                
                if (breakFor) break;
                continue;
            }
            else if (char == "(") {
                if (str.length > 2 && FilterOperatorUtils.isFilterOperator(str, FilterOperator.NOT)) {
                    // Add operator NOT and handle the rest of string as a parenthesis one
                    list.push(str);
                    str = "";
                }

                let {closingCharPosition, simplifiedStr} = this.simplifyParenthesis(filter, i);
                
                // Remove reduntant parenthesis and re parse string
                if (closingCharPosition == filter.length && list.length == 0) {
                    return this.getParsedList(simplifiedStr);
                }
                
                list.push(simplifiedStr);
                i = closingCharPosition;

                continue;
            }
            else if (char == "'") {
                let {simplifiedStr, closingCharPosition} = this.simplifyQuotes(filter, i);
                
                list.push(simplifiedStr);
                i = closingCharPosition;

                continue;
            }

            str += char;
        }

        if (str != "") list.push(str);

        return list;
    }

    // code -> field
    // 'code code' , 1 -> value
    // ('code') , ('code', 'code1') -> values -> NOT SUPPORTED
    static getFilterNodeType(filter : string) {
        // NEEDS REFACTORING!!!
        let hasOnlyOneStr = filter.split(" ").length == 1;
        let hasQuotes = filter[0] == "'";
        
        if (hasQuotes) {
            let closingCharPosition = FilterParser.findClosingCharPosition(filter, "'", "'");
            if (closingCharPosition == filter.length) return FilterNodeType.VALUE;
        }
        else if (hasOnlyOneStr){
            if (!NumberValidator.isNaN(DataTypeValidator.toNumber(filter))) return FilterNodeType.VALUE;
            else return FilterNodeType.FIELD;
        }

        return FilterNodeType.EXPRESSION;
    }

    /**
     * Gets a list with all the items joined into a single item.
     * @param list 
     * @returns 
     */
    private static joinListItems(list : string[]) {
        if (list.length == 0) return list;

        let joinedStr = "";
        for (let i = 0; i < list.length; i++) {
            let str = list[i];

            // Handle NOT operator concatenation
            if (FilterOperatorUtils.isFilterOperator(str, FilterOperator.NOT)) {
                joinedStr = str + "(" + list[++i] + ")";
            }
            else {
                joinedStr += str;
            }

            if (i != list.length - 1) joinedStr += " ";
        }

        return [joinedStr];
    }

    static replaceChars(str : string, openIndex : number, closeIndex? : number) {
        let list = [...str];

        if (closeIndex == null) closeIndex = str.length - 1;

        list[openIndex] = "";
        list[closeIndex] = "";

        return list.join("");
    }

    static replaceQuotes(str : string, openIndex : number, closeIndex? : number) {
        if (closeIndex == null) closeIndex = str.length - 1;

        if (str[openIndex] != "'" && str[closeIndex] != "'") return str;
        else return this.replaceChars(str, openIndex, closeIndex);
    }

    /**
     * Finds closing position of a character.
     * @param str 
     * @param openingChar 
     * @param closingChar 
     * @returns 
     */
    static findClosingCharPosition(str : string, openingChar : string, closingChar : string, openingCharPosition : number = 0) {
        let closingCharPosition = openingCharPosition;
        let counter = 0;
        let sameChars = openingChar == closingChar;

        for (let i = openingCharPosition; i < str.length; i++) {
            let char = str[i];
            if (char == openingChar) {
                if (sameChars && counter > 0) counter--;
                else counter++;
            } 
            else if (char == closingChar) counter--;

            if (counter == 0) {
                closingCharPosition = i + 1;
                break;
            }
        }

        if (closingCharPosition == openingCharPosition) throw new ClosingCharNotFoundError(str, closingChar);

        return closingCharPosition;
    }

    private simplifyParenthesis(filter : string, currentIndex : number) {
        let closingCharPosition = FilterParser.findClosingCharPosition(filter, "(", ")", currentIndex);

        let simplifiedStr = filter.substring(currentIndex, closingCharPosition);
        simplifiedStr = FilterParser.replaceChars(simplifiedStr, 0, closingCharPosition - currentIndex - 1);

        return {simplifiedStr, closingCharPosition};
    }

    private simplifyQuotes(filter : string, currentIndex : number) {
        let closingCharPosition = FilterParser.findClosingCharPosition(filter, "'", "'", currentIndex);

        let simplifiedStr = filter.substring(currentIndex, closingCharPosition);

        return {simplifiedStr, closingCharPosition};
    }
}