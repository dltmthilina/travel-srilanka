import { ResultSetHeader } from "mysql2";
import db from "../utils/database";

interface UserProps {
  id?: number;
  fName?: string;
  lName?: string;
  email: string;
  password: string;
}

export class Tourist implements UserProps {
  id?: number;
  fName?: string;
  lName?: string;
  email: string;
  country?: string;
  password: string;
  dpImageUrl?: string;

  constructor(
    id: number,
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
    const query = `INSERT INTO users(id, firstName, lastName, email, country, password, dpImage) VALUES(?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute<ResultSetHeader>(query, [
      this.id,
      this.fName,
      this.lName,
      this.email,
      this.country,
      this.password,
      this.dpImageUrl,
    ]);
    return result;
  }
  async getById(userId: number) {
    const query = `SELECT * FROM users WHERE id =?`;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }
  getByPlaceId() {}
  getAll() {}
  update() {}
  delete() {}
}
