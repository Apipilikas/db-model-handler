import { Record } from "../record";
import { Relation } from "../relation";
import { IDataTypeValidator } from "./dataTypeValidator";

export class AlreadyInitializedModelError extends Error {
    constructor(modelName : string) {
        super(`Cannot change model [${modelName}] structure. Model has already been initialized.`)
    }
}

export class AlreadyInitializedSchemaError extends Error {
    constructor(schemaName : string) {
        super(`Cannot change schema [${schemaName}] structure. Schema has already meen initialized.`)
    }
}

export class NotInitializedModelError extends Error {
    constructor(modelName : string) {
        super(`Model [${modelName}] has not been initialized. Function initModel has to be overriden.`)
    }
}

export class NotInitializedSchemaError extends Error {
    constructor(schemaName: string) {
        super(`Schema [${schemaName}] has not been initialized. Function initSchema has to be overriden.`)
    }
}

export class ClosingCharNotFoundError extends Error {
    constructor(str : string, closingChar : string) {
        super(`Closing char [${closingChar}] not found in given string [${str}]`);
    }
}

export class FieldNotFoundError extends Error {
    constructor(fieldName : string, modelName : string) {
        super(`Field with name [${fieldName}] was not found on model [${modelName}]`);
    }
}

export class DuplicateRecordError extends Error {
    constructor(record : Record) {
        super(`Record with the primary key/s [${record.model.getPrimaryKeys().toString()}] and values [${record.getPrimaryKeyValues().toString()}] already exists.`);
    }
}

export class ReadOnlyFieldError extends Error {
    constructor(fieldName : string) {
        super(`Field [${fieldName}] is readOnly. Changing values is not permitted.`)
    }
}

export class ValueValidationError extends Error {
    constructor(value : any, validator : IDataTypeValidator) {
        super(`Value validation failed. Given value [${value}] of type [${typeof(value)}] does not agree with the field dataType [${validator.dataType}]`)
    }
}

export class FormatError extends Error {
    constructor(propertyName : string) {
        super(`Input does not have the expected format. Property [${propertyName}] not found.`)
    }

    static getValueOrThrow<T>(obj : any, key : string) {
        let value = obj[key];

        if (value == undefined) throw new FormatError(key);

        return value as T;
    }
}

export class CastError<T> extends Error {
    constructor(obj : any, expectedType : T) {
        super(`Casting object [${obj}] to [${expectedType}] failed. The object [${obj}] is of type [${typeof obj}]`);
    }

    static castOrThrow<T>(value : any, expectedType : T) {
        if (typeof value !== expectedType) throw new CastError(value, expectedType);

        return value as T;
    }
}

export class MergeModelError extends Error {
    constructor(mergedModelName : string, modelName : string, fieldName : string) {
        super(`Model [${modelName}] does not have the field [${fieldName}] that merging model [${mergedModelName}] appears to have.`);
    }
}

export class ForeignFieldConstraintError extends Error {
    constructor(relation : Relation, value : any) {
        super(`Foreign field [${relation.childField.fieldName}] with value [${value}] isn't found on the parent model [${relation.parentModel.modelName}].`)
    }
}