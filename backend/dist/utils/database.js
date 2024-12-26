"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const poolConfig = {
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "root",
    database: process.env.DB_NAME ?? "travel_srilanka",
    waitForConnections: true,
    //connectionLimit: 10, // Number of concurrent connections
    //queueLimit: 0,
};
const pool = promise_1.default.createPool(poolConfig);
exports.default = pool;
