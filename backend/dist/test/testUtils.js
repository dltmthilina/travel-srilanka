"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopServer = exports.startServer = void 0;
const server_1 = __importDefault(require("../server")); // Adjust the path as needed
const startServer = () => server_1.default;
exports.startServer = startServer;
const stopServer = () => server_1.default.close();
exports.stopServer = stopServer;
