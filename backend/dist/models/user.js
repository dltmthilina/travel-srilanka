"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
class Tourist {
    constructor(id, fname, lname, dpImageUrl, email, country, password) {
        this.id = id;
        this.fName = fname;
        this.lName = lname;
        this.email = email;
        this.country = country;
        this.password = password;
        this.dpImageUrl = dpImageUrl;
    }
    async create() {
        const query = `INSERT INTO users(firstName, lastName, email, country, password, imageUrl) VALUES(?, ?, ?, ?, ?, ?)`;
        const [result] = await database_1.default.execute(query, [
            this.fName,
            this.lName,
            this.email,
            this.country,
            this.password,
            this.dpImageUrl,
        ]);
        return result;
    }
    static async getById(userId) {
        const query = `SELECT * FROM users WHERE id =?`;
        const [rows] = await database_1.default.execute(query, [userId]);
        if (rows.length === 0) {
            return null; // No user found
        }
        const row = rows[0];
        return new Tourist(row.id, row.firstName, row.lastName, row.dpImage, row.email, row.country, "");
    }
    static async getByEmail(email) {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await database_1.default.execute(query, [email]);
        if (rows.length === 0) {
            return null; // No user found
        }
        const row = rows[0];
        return new Tourist(row.id, row.firstName, row.lastName, row.dpImage, row.email, row.country, "");
    }
    getByPlaceId() { }
    getAll() { }
    update() { }
    delete() { }
}
exports.default = Tourist;
