import { Record } from "../record";
import { IDataTypeValidator } from "./dataTypeValidator";
export declare class AlreadyInitializedModelError extends Error {
    constructor(modelName: string);
}
export declare class AlreadyInitializedSchemaError extends Error {
    constructor(schemaName: string);
}
export declare class NotInitializedModelError extends Error {
    constructor(modelName: string);
}
export declare class NotInitializedSchemaError extends Error {
    constructor(schemaName: string);
}
export declare class ClosingCharNotFoundError extends Error {
    constructor(str: string, closingChar: string);
}
export declare class FieldNotFoundError extends Error {
    constructor(fieldName: string, modelName: string);
}
export declare class DuplicateRecordError extends Error {
    constructor(record: Record);
}
export declare class ReadOnlyFieldError extends Error {
    constructor(fieldName: string);
}
export declare class ValueValidationError extends Error {
    constructor(value: any, validator: IDataTypeValidator);
}
export declare class FormatError extends Error {
    constructor(propertyName: string);
    static getValueOrThrow<T>(obj: any, key: string): T;
}
export declare class CastError<T> extends Error {
    constructor(obj: any, expectedType: T);
    static castOrThrow<T>(value: any, expectedType: T): T;
}
export declare class MergeModelError extends Error {
    constructor(mergedModelName: string, modelName: string, fieldName: string);
}
//# sourceMappingURL=errors.d.ts.map