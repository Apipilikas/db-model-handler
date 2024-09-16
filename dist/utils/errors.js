"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeModelError = exports.CastError = exports.FormatError = exports.ValueValidationError = exports.ReadOnlyFieldError = exports.DuplicateRecordError = exports.FieldNotFoundError = exports.ClosingCharNotFoundError = exports.NotInitializedSchemaError = exports.NotInitializedModelError = exports.AlreadyInitializedSchemaError = exports.AlreadyInitializedModelError = void 0;
class AlreadyInitializedModelError extends Error {
    constructor(modelName) {
        super(`Cannot change model [${modelName}] structure. Model has already been initialized.`);
    }
}
exports.AlreadyInitializedModelError = AlreadyInitializedModelError;
class AlreadyInitializedSchemaError extends Error {
    constructor(schemaName) {
        super(`Cannot change schema [${schemaName}] structure. Schema has already meen initialized.`);
    }
}
exports.AlreadyInitializedSchemaError = AlreadyInitializedSchemaError;
class NotInitializedModelError extends Error {
    constructor(modelName) {
        super(`Model [${modelName}] has not been initialized. Function initModel has to be overriden.`);
    }
}
exports.NotInitializedModelError = NotInitializedModelError;
class NotInitializedSchemaError extends Error {
    constructor(schemaName) {
        super(`Schema [${schemaName}] has not been initialized. Function initSchema has to be overriden.`);
    }
}
exports.NotInitializedSchemaError = NotInitializedSchemaError;
class ClosingCharNotFoundError extends Error {
    constructor(str, closingChar) {
        super(`Closing char [${closingChar}] not found in given string [${str}]`);
    }
}
exports.ClosingCharNotFoundError = ClosingCharNotFoundError;
class FieldNotFoundError extends Error {
    constructor(fieldName, modelName) {
        super(`Field with name [${fieldName}] was not found on model [${modelName}]`);
    }
}
exports.FieldNotFoundError = FieldNotFoundError;
class DuplicateRecordError extends Error {
    constructor(record) {
        super(`Record with the same primary key/s [${record.model.getPrimaryKeys().toString()}] already exists.`);
    }
}
exports.DuplicateRecordError = DuplicateRecordError;
class ReadOnlyFieldError extends Error {
    constructor(fieldName) {
        super(`Field [${fieldName}] is readOnly. Changing values is not permitted.`);
    }
}
exports.ReadOnlyFieldError = ReadOnlyFieldError;
class ValueValidationError extends Error {
    constructor(value, validator) {
        super(`Value validation failed. Given value [${value}] of type [${typeof (value)}] does not agree with the field dataType [${validator.dataType}]`);
    }
}
exports.ValueValidationError = ValueValidationError;
class FormatError extends Error {
    constructor(propertyName) {
        super(`Input does not have the expected format. Property [${propertyName}] not found.`);
    }
    static getValueOrThrow(obj, key) {
        let value = obj[key];
        if (value == undefined)
            throw new FormatError(key);
        return value;
    }
}
exports.FormatError = FormatError;
class CastError extends Error {
    constructor(obj, expectedType) {
        super(`Casting object [${obj}] to [${expectedType}] failed. The object [${obj}] is of type [${typeof obj}]`);
    }
    static castOrThrow(value, expectedType) {
        if (typeof value !== expectedType)
            throw new CastError(value, expectedType);
        return value;
    }
}
exports.CastError = CastError;
class MergeModelError extends Error {
    constructor(mergedModelName, modelName, fieldName) {
        super(`Model [${modelName}] does not have the field [${fieldName}] that merging model [${mergedModelName}] appears to have.`);
    }
}
exports.MergeModelError = MergeModelError;
