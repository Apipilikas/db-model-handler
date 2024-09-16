import { Field } from "./field";
export declare enum FieldValueVersion {
    DEFAULT = 0,
    ORIGINAL = 1,
    CURRENT = 2
}
export declare class FieldValue {
    private _field;
    private _dataTypeValidator;
    private _defaultValue;
    private _originalValue;
    private _currentValue;
    /**
     * FieldValue constructor
     * @param field Referenced field
     * @param value Value of the field
     * @constructor
     */
    private constructor();
    /**
     * Gets field.
     */
    get field(): Field;
    /**
     * Gets field name.
     */
    get fieldName(): string;
    /**
     * Gets value depending on its version.
     * @param version Version of the value
     * @returns The value
     */
    getValue(version: FieldValueVersion): any;
    /**
     * Gets current version of the value.
     */
    get value(): any;
    /**
     * Sets value.
     */
    set value(value: any);
    /**
     * Creates new FieldValue with default value as value. Used to store new data.
     * @param field Referenced field
     * @returns FieldValue instance
     */
    static new(field: Field): FieldValue;
    /**
     * Creates new FieldValue with specified value as value.
     * Used to store existing data.
     * @param field
     * @param value
     * @returns FieldValue instance
     */
    static loadData(field: Field, value: any): FieldValue;
    static copy(field: Field, fieldValue: FieldValue): FieldValue;
    /**
     * Shows if value has changed. Change occurs when original value is different from the current one.
     */
    hasChanged(): boolean;
    /**
     * Accepts change and stores the current value into the original one.
     */
    acceptChange(): void;
    /**
     * Rejects change and rollback current value to the original one.
     */
    rejectChange(): void;
}
//# sourceMappingURL=fieldValue.d.ts.map