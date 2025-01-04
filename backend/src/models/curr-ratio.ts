import { ResultSetHeader } from "mysql2";
import db from "../utils/database";

export class CurrencyRate {
  cur1: string;
  cur2: string;
  rate: number;

  constructor(cur1: string, cur2: string, rate: number) {
    this.cur1 = cur1;
    this.cur2 = cur2;
    this.rate = rate;
  }

  displayRate(): void {
    console.log(
      `The exchange rate from ${this.cur1} to ${this.cur2} is ${this.rate}`
    );
  }

  async addRatio(): Promise<ResultSetHeader> {
    const query = "INSERT INTO currency (cur1, cur2, ratio) VALUES (?, ?, ?)";
    try {
      console.log(this.cur1, this.cur2);
      const [results] = await db.execute<ResultSetHeader>(query, [
        this.cur1,
        this.cur2,
        this.rate,
      ]);

      return results;
    } catch (error) {
      throw new Error("Database query failed");
    }
  }
}
