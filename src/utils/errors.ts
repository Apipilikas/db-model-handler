import { Record } from "../record";
import { Relation } from "../relation";
import { IDataTypeValidator } from "./dataTypeValidator";

export class DBModelHandlerError extends Error {
    constructor(message : string) {
        super(message)
    }
}

export class AlreadyInitializedModelError extends DBModelHandlerError {
    constructor(modelName : string) {
        super(`Cannot change model [${modelName}] structure. Model has already been initialized.`);
    }
}

export class AlreadyInitializedSchemaError extends DBModelHandlerError {
    constructor(schemaName : string) {
        super(`Cannot change schema [${schemaName}] structure. Schema has already been initialized.`);
    }
}

export class AlreadyOnChangeModeError extends DBModelHandlerError {
    constructor(record : Record) {
        super(`Record with the primary key/s [${record.model.getPrimaryKeyName().toString()}] from model [${record.model.modelName}] is already on Change mode.`);
    }
}

export class NotOnChangeModeError extends DBModelHandlerError {
    constructor(record : Record) {
        super(`Record with the primary key/s [${record.model.getPrimaryKeyName().toString()}] from model [${record.model.modelName}] is not on Change mode. You should first invoke beginChanges function.`);
    }
}

export class NotInitializedModelError extends DBModelHandlerError {
    constructor(modelName : string) {
        super(`Model [${modelName}] has not been initialized. Function initModel has to be overriden.`);
    }
}

export class NotInitializedSchemaError extends DBModelHandlerError {
    constructor(schemaName: string) {
        super(`Schema [${schemaName}] has not been initialized. Function initSchema has to be overriden.`);
    }
}

export class ClosingCharNotFoundError extends DBModelHandlerError {
    constructor(str : string, closingChar : string) {
        super(`Closing char [${closingChar}] not found in given string [${str}]`);
    }
}

export class FieldNotFoundError extends DBModelHandlerError {
    constructor(fieldName : string, modelName : string) {
        super(`Field with name [${fieldName}] was not found on model [${modelName}]`);
    }
}

export class DuplicateRecordError extends DBModelHandlerError {
    constructor(record : Record) {
        super(`Record with the primary key/s [${record.model.getPrimaryKeyName().toString()}] and values [${record.getPrimaryKeyValue().toString()}] already exists.`);
    }
}

export class ReadOnlyFieldError extends DBModelHandlerError {
    constructor(fieldName : string) {
        super(`Field [${fieldName}] is readOnly. Changing values is not permitted.`);
    }
}

export class NullableFieldError extends DBModelHandlerError {
    constructor(fieldName : string) {
        super(`Field [${fieldName}] does not accept null values.`);
    }
}

export class ValueValidationError extends DBModelHandlerError {
    constructor(value : any, validator : IDataTypeValidator) {
        super(`Value validation failed. Given value [${value}] of type [${typeof(value)}] does not agree with the field dataType [${validator.dataType}]`);
    }
}

export class FormatError extends DBModelHandlerError {
    constructor(propertyName : string) {
        super(`Input does not have the expected format. Property [${propertyName}] not found.`);
    }

    static getValueOrThrow<T>(obj : any, key : string) {
        let value = obj[key];

        if (value == undefined) throw new FormatError(key);

        return value as T;
    }
}

export class CastError<T> extends DBModelHandlerError {
    constructor(obj : any, expectedType : T) {
        super(`Casting object [${obj}] to [${expectedType}] failed. The object [${obj}] is of type [${typeof obj}]`);
    }

    static castOrThrow<T>(value : any, expectedType : T) {
        if (typeof value !== expectedType) throw new CastError(value, expectedType);

        return value as T;
    }
}

export class MergeModelError extends DBModelHandlerError {
    constructor(mergedModelName : string, modelName : string, fieldName : string) {
        super(`Model [${modelName}] does not have the field [${fieldName}] that merging model [${mergedModelName}] appears to have.`);
    }
}

export class ForeignFieldConstraintError extends DBModelHandlerError {
    constructor(relation : Relation, value : any) {
        super(`Foreign field [${relation.childField.fieldName}] of model [${relation.childModel.modelName}] with value [${value}] isn't found on the parent model [${relation.parentModel.modelName}].`);
    }
}

export class ForeignFieldReferenceError extends DBModelHandlerError {
    constructor(relation : Relation) {
        super(`Record cannot be deleted as foreign field [${relation.parentField.fieldName}] of model [${relation.parentModel.modelName}] references child model [${relation.childModel.modelName}].`);
    }
}