"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBModelHandlerError = exports.DataTypeValidator = exports.FieldValueVersion = exports.Field = exports.Record = exports.Model = exports.Schema = void 0;
const schema_1 = require("./schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return schema_1.Schema; } });
const model_1 = require("./model");
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return model_1.Model; } });
const record_1 = require("./record");
Object.defineProperty(exports, "Record", { enumerable: true, get: function () { return record_1.Record; } });
const field_1 = require("./field");
Object.defineProperty(exports, "Field", { enumerable: true, get: function () { return field_1.Field; } });
const fieldValue_1 = require("./fieldValue");
Object.defineProperty(exports, "FieldValueVersion", { enumerable: true, get: function () { return fieldValue_1.FieldValueVersion; } });
const DataTypeValidator = __importStar(require("./utils/dataTypeValidator"));
exports.DataTypeValidator = DataTypeValidator;
const DBModelHandlerError = __importStar(require("./utils/errors"));
exports.DBModelHandlerError = DBModelHandlerError;
