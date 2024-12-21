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

export default class TourPlace implements PlaceAttributes {
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
    const query = `INSERT INTO places (title, description, longitude, latitude, userId ) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute<ResultSetHeader>(query, [
      this.title,
      this.description,
      this.location.longitude,
      this.location.latitude,
      this.userId,
    ]);
    return result;
  }

  static async getPlaceById(placeId: number): Promise<TourPlace | null> {
    const query = "SELECT * FROM places WHERE id = ?";
    const [rows]: any[] = await db.execute<ResultSetHeader>(query, [placeId]);
    if (rows.length === 0) {
      return null; // No user found
    }
    const row = rows[0];
    return new TourPlace(
      row.id,
      row.title,
      row.description,
      { longitude: row.longitude, latitude: row.latitude },
      row.userId
    );
  }

  async updatePlace(): Promise<ResultSetHeader> {
    const query = `UPDATE places 
               SET title = COALESCE(?, title), 
                   description = COALESCE(?, description), 
                   longitude = COALESCE(?, longitude), 
                   latitude = COALESCE(?, latitude) 
               WHERE id = ?`;
    const [result] = await db.execute<ResultSetHeader>(query, [
      this.title,
      this.description,
      this.location.longitude,
      this.location.latitude,
      this.id,
    ]);
    return result;
  }

  static async deletePlace<ResultSetHeader>(placeId: number) {
    const query = `DELETE FROM places WHERE id = ?`;
    const result = await db.execute(query, [placeId]);
    return result;
  }
}
