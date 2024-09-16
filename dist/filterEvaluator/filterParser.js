"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterParser = void 0;
const dataTypeValidator_1 = require("../utils/dataTypeValidator");
const errors_1 = require("../utils/errors");
const filterNode_1 = require("./filterNode");
class FilterParser {
    constructor(filter) {
        this._leftFilterExp = "";
        this._rightFilterExp = "";
        this._filter = filter;
        this._filterOperator = filterNode_1.FilterOperator.NONE;
    }
    static parse(filter) {
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
            this._filterOperator = filterNode_1.FilterOperatorUtils.getFilterOperator(parsedList[1]);
            this._rightFilterExp = parsedList[2];
        }
        else if (parsedList.length == 2 && filterNode_1.FilterOperatorUtils.isFilterOperator(parsedList[0], filterNode_1.FilterOperator.NOT)) {
            this._filterOperator = filterNode_1.FilterOperatorUtils.getFilterOperator(parsedList[0]);
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
    getParsedList(filter) {
        let list = [];
        let breakFor = false;
        let str = "";
        for (let i = 0; i < filter.length; i++) {
            let char = filter[i];
            if (char == " ") {
                switch (filterNode_1.FilterOperatorUtils.getFilterOperator(str)) {
                    case filterNode_1.FilterOperator.IN:
                    case filterNode_1.FilterOperator.NOT:
                    case filterNode_1.FilterOperator.AND:
                    case filterNode_1.FilterOperator.OR:
                        list = FilterParser.joinListItems(list);
                        list.push(str);
                        // rest string
                        str = filter.substring(i + 1); // +1 for the last char of operator
                        breakFor = true;
                        break;
                }
                list.push(str);
                str = "";
                if (breakFor)
                    break;
                continue;
            }
            else if (char == "(") {
                if (str.length > 2 && filterNode_1.FilterOperatorUtils.isFilterOperator(str, filterNode_1.FilterOperator.NOT)) {
                    // Add operator NOT and handle the rest of string as a parenthesis one
                    list.push(str);
                    str = "";
                }
                let { closingCharPosition, simplifiedStr } = this.simplifyParenthesis(filter, i);
                // Remove reduntant parenthesis and re parse string
                if (closingCharPosition == filter.length && list.length == 0) {
                    return this.getParsedList(simplifiedStr);
                }
                list.push(simplifiedStr);
                i = closingCharPosition;
                continue;
            }
            else if (char == "'") {
                let { simplifiedStr, closingCharPosition } = this.simplifyQuotes(filter, i);
                list.push(simplifiedStr);
                i = closingCharPosition;
                continue;
            }
            str += char;
        }
        if (str != "")
            list.push(str);
        return list;
    }
    // code -> field
    // 'code code' , 1 -> value
    // ('code') , ('code', 'code1') -> values -> NOT SUPPORTED
    static getFilterNodeType(filter) {
        // NEEDS REFACTORING!!!
        let hasOnlyOneStr = filter.split(" ").length == 1;
        let hasQuotes = filter[0] == "'";
        if (hasQuotes) {
            let closingCharPosition = FilterParser.findClosingCharPosition(filter, "'", "'");
            if (closingCharPosition == filter.length)
                return filterNode_1.FilterNodeType.VALUE;
        }
        else if (hasOnlyOneStr) {
            if (!dataTypeValidator_1.NumberValidator.isNaN(dataTypeValidator_1.DataTypeValidator.toNumber(filter)))
                return filterNode_1.FilterNodeType.VALUE;
            else
                return filterNode_1.FilterNodeType.FIELD;
        }
        return filterNode_1.FilterNodeType.EXPRESSION;
    }
    /**
     * Gets a list with all the items joined into a single item.
     * @param list
     * @returns
     */
    static joinListItems(list) {
        if (list.length == 0)
            return list;
        let joinedStr = "";
        for (let i = 0; i < list.length; i++) {
            let str = list[i];
            // Handle NOT operator concatenation
            if (filterNode_1.FilterOperatorUtils.isFilterOperator(str, filterNode_1.FilterOperator.NOT)) {
                joinedStr = str + "(" + list[++i] + ")";
            }
            else {
                joinedStr += str;
            }
            if (i != list.length - 1)
                joinedStr += " ";
        }
        return [joinedStr];
    }
    static replaceChars(str, openIndex, closeIndex) {
        let list = [...str];
        if (closeIndex == null)
            closeIndex = str.length - 1;
        list[openIndex] = "";
        list[closeIndex] = "";
        return list.join("");
    }
    static replaceQuotes(str, openIndex, closeIndex) {
        if (closeIndex == null)
            closeIndex = str.length - 1;
        if (str[openIndex] != "'" && str[closeIndex] != "'")
            return str;
        else
            return this.replaceChars(str, openIndex, closeIndex);
    }
    /**
     * Finds closing position of a character.
     * @param str
     * @param openingChar
     * @param closingChar
     * @returns
     */
    static findClosingCharPosition(str, openingChar, closingChar, openingCharPosition = 0) {
        let closingCharPosition = openingCharPosition;
        let counter = 0;
        let sameChars = openingChar == closingChar;
        for (let i = openingCharPosition; i < str.length; i++) {
            let char = str[i];
            if (char == openingChar) {
                if (sameChars && counter > 0)
                    counter--;
                else
                    counter++;
            }
            else if (char == closingChar)
                counter--;
            if (counter == 0) {
                closingCharPosition = i + 1;
                break;
            }
        }
        if (closingCharPosition == openingCharPosition)
            throw new errors_1.ClosingCharNotFoundError(str, closingChar);
        return closingCharPosition;
    }
    simplifyParenthesis(filter, currentIndex) {
        let closingCharPosition = FilterParser.findClosingCharPosition(filter, "(", ")", currentIndex);
        let simplifiedStr = filter.substring(currentIndex, closingCharPosition);
        simplifiedStr = FilterParser.replaceChars(simplifiedStr, 0, closingCharPosition - currentIndex - 1);
        return { simplifiedStr, closingCharPosition };
    }
    simplifyQuotes(filter, currentIndex) {
        let closingCharPosition = FilterParser.findClosingCharPosition(filter, "'", "'", currentIndex);
        let simplifiedStr = filter.substring(currentIndex, closingCharPosition);
        return { simplifiedStr, closingCharPosition };
    }
}
exports.FilterParser = FilterParser;
