"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // Call the parent class constructor (Error)
        this.code = errorCode; // Assign the custom error code
        Object.setPrototypeOf(this, HttpError.prototype); // Maintain prototype chain
    }
}
exports.default = HttpError;
