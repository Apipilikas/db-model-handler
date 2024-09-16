import { Field } from "./field"
import { DataTypeValidator, IDataTypeValidator } from "./utils/dataTypeValidator"
import { ReadOnlyFieldError, ValueValidationError } from "./utils/errors";

export enum FieldValueVersion {
    DEFAULT = 0,
    ORIGINAL = 1,
    CURRENT = 2
}

export class FieldValue {
    private _field : Field;
    private _dataTypeValidator : IDataTypeValidator;
    private _defaultValue : any;
    private _originalValue : any;
    private _currentValue : any;

    /**
     * FieldValue constructor
     * @param field Referenced field
     * @param value Value of the field
     * @constructor
     */
    private constructor(field : Field, value : any) {
        this._field = field;
        this._dataTypeValidator = DataTypeValidator.resolve(field.dataType);
        this._defaultValue = this._field.defaultValue;
        this._originalValue = this._dataTypeValidator.parseValue(value);
        this._currentValue = this._originalValue;
    }

    /**
     * Gets field.
     */
    get field() : Field {
        return this._field;
    }

    /**
     * Gets field name.
     */
    get fieldName() : string {
        return this._field.fieldName;
    }

    /**
     * Gets value depending on its version.
     * @param version Version of the value
     * @returns The value
     */
    getValue(version : FieldValueVersion) {
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
    set value(value : any) {
        if (this._field.readOnly) throw new ReadOnlyFieldError(this._field.fieldName);
        if (!this._dataTypeValidator.isValid(value)) throw new ValueValidationError(value, this._dataTypeValidator);

        this._currentValue = this._dataTypeValidator.parseValue(value);
    }

    /**
     * Creates new FieldValue with default value as value. Used to store new data.
     * @param field Referenced field
     * @returns FieldValue instance
     */
    static new(field : Field) {
        return new FieldValue(field, field.defaultValue);
    }

    /**
     * Creates new FieldValue with specified value as value.
     * Used to store existing data.
     * @param field 
     * @param value 
     * @returns FieldValue instance
     */
    static loadData(field : Field, value : any) {
        return new FieldValue(field, value);
    }

    static copy(field : Field, fieldValue : FieldValue) {
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