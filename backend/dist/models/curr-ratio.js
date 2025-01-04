"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRate = void 0;
const database_1 = __importDefault(require("../utils/database"));
class CurrencyRate {
    constructor(cur1, cur2, rate) {
        this.cur1 = cur1;
        this.cur2 = cur2;
        this.rate = rate;
    }
    displayRate() {
        console.log(`The exchange rate from ${this.cur1} to ${this.cur2} is ${this.rate}`);
    }
    async addRatio() {
        const query = "INSERT INTO currency (cur1, cur2, ratio) VALUES (?, ?, ?)";
        try {
            console.log(this.cur1, this.cur2);
            const [results] = await database_1.default.execute(query, [
                this.cur1,
                this.cur2,
                this.rate,
            ]);
            return results;
        }
        catch (error) {
            throw new Error("Database query failed");
        }
    }
}
exports.CurrencyRate = CurrencyRate;
