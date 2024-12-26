import { Record } from "../record";
import { Relation } from "../relation";
import { IDataTypeValidator } from "./dataTypeValidator";
export declare class DBModelHandlerError extends Error {
    constructor(message: string);
}
export declare class AlreadyInitializedModelError extends DBModelHandlerError {
    constructor(modelName: string);
}
export declare class AlreadyInitializedSchemaError extends DBModelHandlerError {
    constructor(schemaName: string);
}
export declare class AlreadyOnChangeModeError extends DBModelHandlerError {
    constructor(record: Record);
}
export declare class NotOnChangeModeError extends DBModelHandlerError {
    constructor(record: Record);
}
export declare class NotInitializedModelError extends DBModelHandlerError {
    constructor(modelName: string);
}
export declare class NotInitializedSchemaError extends DBModelHandlerError {
    constructor(schemaName: string);
}
export declare class ClosingCharNotFoundError extends DBModelHandlerError {
    constructor(str: string, closingChar: string);
}
export declare class FieldNotFoundError extends DBModelHandlerError {
    constructor(fieldName: string, modelName: string);
}
export declare class DuplicateRecordError extends DBModelHandlerError {
    constructor(record: Record);
}
export declare class ReadOnlyFieldError extends DBModelHandlerError {
    constructor(fieldName: string);
}
export declare class NullableFieldError extends DBModelHandlerError {
    constructor(fieldName: string);
}
export declare class ValueValidationError extends DBModelHandlerError {
    constructor(value: any, validator: IDataTypeValidator);
}
export declare class FormatError extends DBModelHandlerError {
    constructor(propertyName: string);
    static getValueOrThrow<T>(obj: any, key: string): T;
}
export declare class CastError<T> extends DBModelHandlerError {
    constructor(obj: any, expectedType: T);
    static castOrThrow<T>(value: any, expectedType: T): T;
}
export declare class MergeModelError extends DBModelHandlerError {
    constructor(mergedModelName: string, modelName: string, fieldName: string);
}
export declare class ForeignFieldConstraintError extends DBModelHandlerError {
    constructor(relation: Relation, value: any);
}
export declare class ForeignFieldReferenceError extends DBModelHandlerError {
    constructor(relation: Relation);
}
//# sourceMappingURL=errors.d.ts.map