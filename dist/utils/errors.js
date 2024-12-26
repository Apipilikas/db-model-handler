"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignFieldReferenceError = exports.ForeignFieldConstraintError = exports.MergeModelError = exports.CastError = exports.FormatError = exports.ValueValidationError = exports.NullableFieldError = exports.ReadOnlyFieldError = exports.DuplicateRecordError = exports.FieldNotFoundError = exports.ClosingCharNotFoundError = exports.NotInitializedSchemaError = exports.NotInitializedModelError = exports.NotOnChangeModeError = exports.AlreadyOnChangeModeError = exports.AlreadyInitializedSchemaError = exports.AlreadyInitializedModelError = exports.DBModelHandlerError = void 0;
class DBModelHandlerError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.DBModelHandlerError = DBModelHandlerError;
class AlreadyInitializedModelError extends DBModelHandlerError {
    constructor(modelName) {
        super(`Cannot change model [${modelName}] structure. Model has already been initialized.`);
    }
}
exports.AlreadyInitializedModelError = AlreadyInitializedModelError;
class AlreadyInitializedSchemaError extends DBModelHandlerError {
    constructor(schemaName) {
        super(`Cannot change schema [${schemaName}] structure. Schema has already been initialized.`);
    }
}
exports.AlreadyInitializedSchemaError = AlreadyInitializedSchemaError;
class AlreadyOnChangeModeError extends DBModelHandlerError {
    constructor(record) {
        super(`Record with the primary key/s [${record.model.getPrimaryKeyName().toString()}] from model [${record.model.modelName}] is already on Change mode.`);
    }
}
exports.AlreadyOnChangeModeError = AlreadyOnChangeModeError;
class NotOnChangeModeError extends DBModelHandlerError {
    constructor(record) {
        super(`Record with the primary key/s [${record.model.getPrimaryKeyName().toString()}] from model [${record.model.modelName}] is not on Change mode. You should first invoke beginChanges function.`);
    }
}
exports.NotOnChangeModeError = NotOnChangeModeError;
class NotInitializedModelError extends DBModelHandlerError {
    constructor(modelName) {
        super(`Model [${modelName}] has not been initialized. Function initModel has to be overriden.`);
    }
}
exports.NotInitializedModelError = NotInitializedModelError;
class NotInitializedSchemaError extends DBModelHandlerError {
    constructor(schemaName) {
        super(`Schema [${schemaName}] has not been initialized. Function initSchema has to be overriden.`);
    }
}
exports.NotInitializedSchemaError = NotInitializedSchemaError;
class ClosingCharNotFoundError extends DBModelHandlerError {
    constructor(str, closingChar) {
        super(`Closing char [${closingChar}] not found in given string [${str}]`);
    }
}
exports.ClosingCharNotFoundError = ClosingCharNotFoundError;
class FieldNotFoundError extends DBModelHandlerError {
    constructor(fieldName, modelName) {
        super(`Field with name [${fieldName}] was not found on model [${modelName}]`);
    }
}
exports.FieldNotFoundError = FieldNotFoundError;
class DuplicateRecordError extends DBModelHandlerError {
    constructor(record) {
        super(`Record with the primary key/s [${record.model.getPrimaryKeyName().toString()}] and values [${record.getPrimaryKeyValue().toString()}] already exists.`);
    }
}
exports.DuplicateRecordError = DuplicateRecordError;
class ReadOnlyFieldError extends DBModelHandlerError {
    constructor(fieldName) {
        super(`Field [${fieldName}] is readOnly. Changing values is not permitted.`);
    }
}
exports.ReadOnlyFieldError = ReadOnlyFieldError;
class NullableFieldError extends DBModelHandlerError {
    constructor(fieldName) {
        super(`Field [${fieldName}] does not accept null values.`);
    }
}
exports.NullableFieldError = NullableFieldError;
class ValueValidationError extends DBModelHandlerError {
    constructor(value, validator) {
        super(`Value validation failed. Given value [${value}] of type [${typeof (value)}] does not agree with the field dataType [${validator.dataType}]`);
    }
}
exports.ValueValidationError = ValueValidationError;
class FormatError extends DBModelHandlerError {
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
class CastError extends DBModelHandlerError {
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
class MergeModelError extends DBModelHandlerError {
    constructor(mergedModelName, modelName, fieldName) {
        super(`Model [${modelName}] does not have the field [${fieldName}] that merging model [${mergedModelName}] appears to have.`);
    }
}
exports.MergeModelError = MergeModelError;
class ForeignFieldConstraintError extends DBModelHandlerError {
    constructor(relation, value) {
        super(`Foreign field [${relation.childField.fieldName}] of model [${relation.childModel.modelName}] with value [${value}] isn't found on the parent model [${relation.parentModel.modelName}].`);
    }
}
exports.ForeignFieldConstraintError = ForeignFieldConstraintError;
class ForeignFieldReferenceError extends DBModelHandlerError {
    constructor(relation) {
        super(`Record cannot be deleted as foreign field [${relation.parentField.fieldName}] of model [${relation.parentModel.modelName}] references child model [${relation.childModel.modelName}].`);
    }
}
exports.ForeignFieldReferenceError = ForeignFieldReferenceError;
