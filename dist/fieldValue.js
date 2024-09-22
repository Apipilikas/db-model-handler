"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldValue = exports.FieldValueVersion = void 0;
const dataTypeValidator_1 = require("./utils/dataTypeValidator");
const errors_1 = require("./utils/errors");
var FieldValueVersion;
(function (FieldValueVersion) {
    FieldValueVersion[FieldValueVersion["DEFAULT"] = 0] = "DEFAULT";
    FieldValueVersion[FieldValueVersion["ORIGINAL"] = 1] = "ORIGINAL";
    FieldValueVersion[FieldValueVersion["CURRENT"] = 2] = "CURRENT";
})(FieldValueVersion || (exports.FieldValueVersion = FieldValueVersion = {}));
class FieldValue {
    /**
     * @constructor FieldValue constructor
     * @param field Referenced field
     * @param value Value of the field
     */
    constructor(field, value) {
        this._field = field;
        this._dataTypeValidator = dataTypeValidator_1.DataTypeValidator.resolve(field.dataType);
        this._defaultValue = this._field.defaultValue;
        this._originalValue = this._dataTypeValidator.parseValue(value);
        this._currentValue = this._originalValue;
    }
    /**
     * Gets field.
     */
    get field() {
        return this._field;
    }
    /**
     * Gets field name.
     */
    get fieldName() {
        return this._field.fieldName;
    }
    /**
     * Gets value depending on its version.
     * @param version Version of the value
     * @returns The value
     */
    getValue(version) {
        switch (version) {
            case FieldValueVersion.DEFAULT: return this._defaultValue;
            case FieldValueVersion.ORIGINAL: return this._originalValue;
            case FieldValueVersion.CURRENT: return this._currentValue;
        }
    }
    /**
     * Gets current version of the value.
     */
    get value() {
        return this._currentValue;
    }
    /**
     * Sets value.
     */
    set value(value) {
        if (this._field.readOnly)
            throw new errors_1.ReadOnlyFieldError(this._field.fieldName);
        if (this._field.model.strictMode && !this._dataTypeValidator.isValid(value))
            throw new errors_1.ValueValidationError(value, this._dataTypeValidator);
        this._currentValue = this._dataTypeValidator.parseValue(value);
    }
    /**
     * Creates new FieldValue with default value as value. Used to store new data.
     * @param field Referenced field
     */
    static new(field) {
        return new FieldValue(field, field.defaultValue);
    }
    /**
     * Creates new FieldValue with specified value as value.
     * Used to store existing data.
     * @param field The referenced field
     * @param value The value
     */
    static loadData(field, value) {
        return new FieldValue(field, value);
    }
    /**
     * Copies a FieldValue into a new one preserving its behavior.
     * @param field The referenced field
     * @param fieldValue The field value to be copied
     */
    static copy(field, fieldValue) {
        let copiedFieldValue = new FieldValue(field, fieldValue._originalValue);
        copiedFieldValue._currentValue = fieldValue._currentValue;
        return copiedFieldValue;
    }
    /**
     * Shows if value has changed. Change occurs when original value is different from the current one.
     */
    hasChanged() {
        return this._originalValue != this._currentValue;
    }
    /**
     * Accepts change and stores the current value into the original one.
     */
    acceptChange() {
        if (this.hasChanged()) {
            this._originalValue = this._currentValue;
        }
    }
    /**
     * Rejects change and rollback current value to the original one.
     */
    rejectChange() {
        if (this.hasChanged()) {
            this._currentValue = this._originalValue;
        }
    }
}
exports.FieldValue = FieldValue;
