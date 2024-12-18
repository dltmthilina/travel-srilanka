import { ResultSetHeader } from "mysql2";
import db from "../utils/database";

interface location {
  longitude: number;
  latitude: number;
}

interface PlaceAttributes {
  id: number | null;
  title: string;
  description: string;
  location: location;
  userId: number;
}

export class TourPlace implements PlaceAttributes {
  constructor(
    id: number | null,
    title: string,
    description: string,
    location: location,
    userId: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.userId = userId;
  }
  id: number | null;
  title: string;
  description: string;
  location: location;
  userId: number;

  async createPlace(): Promise<ResultSetHeader> {
    const query = `INSERT INTO Places (title, description, longitude, latitude, userId ) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute<ResultSetHeader>(query, [
      this.title,
      this.description,
      this.location.longitude,
      this.location.latitude,
      this.userId,
    ]);
    return result;
  }
}
