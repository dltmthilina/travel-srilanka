import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  conuntry: String,
  dpImage: String,
});

export const User = mongoose.model("User", userSchema);

/* import { ResultSetHeader } from "mysql2";
import db from "../db/sql_con";

interface UserProps {
  id: number | null;
  fName?: string;
  lName?: string;
  email: string;
}

export default class Tourist implements UserProps {
  id: number | null;
  fName?: string;
  lName?: string;
  email: string;
  country?: string;
  password?: string;
  dpImageUrl?: string;

  constructor(
    id: number | null,
    fname: string,
    lname: string,
    dpImageUrl: string,
    email: string,
    country: string,
    password: string
  ) {
    this.id = id;
    this.fName = fname;
    this.lName = lname;
    this.email = email;
    this.country = country;
    this.password = password;
    this.dpImageUrl = dpImageUrl;
  }

  async create(): Promise<ResultSetHeader> {
    const query = `INSERT INTO users(firstName, lastName, email, country, password, imageUrl) VALUES(?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute<ResultSetHeader>(query, [
      this.fName,
      this.lName,
      this.email,
      this.country,
      this.password,
      this.dpImageUrl,
    ]);
    return result;
  }
  static async getById(userId: number): Promise<Tourist | null> {
    const query = `SELECT * FROM users WHERE id =?`;
    const [rows]: any[] = await db.execute(query, [userId]);
    if (rows.length === 0) {
      return null; // No user found
    }
    const row = rows[0];
    return new Tourist(
      row.id,
      row.firstName,
      row.lastName,
      row.dpImage,
      row.email,
      row.country,
      ""
    );
  }

  static async getByEmail(email: string): Promise<Tourist | null> {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows]: any[] = await db.execute(query, [email]);
    if (rows.length === 0) {
      return null; // No user found
    }
    const row = rows[0];
    return new Tourist(
      row.id,
      row.firstName,
      row.lastName,
      row.dpImage,
      row.email,
      row.country,
      ""
    );
  }

  getByPlaceId() {}
  getAll() {}
  update() {}
  delete() {}
}
 */
