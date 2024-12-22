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
  district: string;
  categories: number[];
  userId: number;
}

export default class TourPlace implements PlaceAttributes {
  constructor(
    id: number | null,
    title: string,
    description: string,
    location: location,
    district: string,
    categories: number[] = [],
    userId: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.district = district;
    this.categories = categories;
    this.userId = userId;
  }

  id: number | null;
  title: string;
  description: string;
  location: location;
  district: string;
  categories: number[];
  userId: number;

  async createPlace(): Promise<ResultSetHeader> {
    const query = `INSERT INTO places (title, description, longitude, latitude,district, userId ) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute<ResultSetHeader>(query, [
      this.title,
      this.description,
      this.location.longitude,
      this.location.latitude,
      this.district,
      this.userId,
    ]);

    const placeId = result.insertId;

    // Insert into place_categories table
    for (const categoryId of this.categories) {
      await db.execute(
        `INSERT INTO place_categories (place_id, category_id) VALUES (?, ?)`,
        [placeId, categoryId]
      );
    }
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
      row.district,
      row.categories,
      row.userId
    );
  }

  async updatePlace(): Promise<TourPlace | null> {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const query = `UPDATE places 
               SET title = COALESCE(?, title), 
                   description = COALESCE(?, description), 
                   longitude = COALESCE(?, longitude), 
                   latitude = COALESCE(?, latitude),
                   district = COALESCE(?, district)
               WHERE id = ?`;

      const [result] = await connection.execute<ResultSetHeader>(query, [
        this.title,
        this.description,
        this.location.longitude,
        this.location.latitude,
        this.district,
        this.id,
      ]);

      if (result.affectedRows === 0) {
        await connection.rollback(); // Rollback transaction
        connection.release(); // Release connection
        return null;
      }

      await connection.execute(
        `DELETE FROM place_categories WHERE place_id = ?`,
        [this.id]
      );

      for (const categoryId of this.categories) {
        const [categoryResult] = await connection.execute<ResultSetHeader>(
          `INSERT INTO place_categories (place_id, category_id) VALUES (?, ?)`,
          [this.id, categoryId]
        );

        if (categoryResult.affectedRows === 0) {
          await connection.rollback(); // Rollback transaction if category insertion fails
          connection.release();
          return null;
        }
      }
      await connection.commit(); // Commit transaction if everything succeeds
      connection.release();

      return new TourPlace(
        this.id,
        this.title,
        this.description,
        {
          longitude: this.location.longitude,
          latitude: this.location.latitude,
        },
        this.district,
        this.categories,
        this.userId
      );
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      connection.release(); // Release connection
      throw error;
    }
  }

  static async deletePlace(placeId: number): Promise<ResultSetHeader> {
    const query = `DELETE FROM places WHERE id = ?`;
    const [result] = await db.execute<ResultSetHeader>(query, [placeId]);
    return result;
  }

  static async getPlacesByUid(userId: number): Promise<TourPlace[] | null> {
    const query = `SELECT * FROM places WHERE userId = ?`;
    const [rows]: any[] = await db.execute<ResultSetHeader>(query, [userId]);

    if (rows.length === 0) {
      return null;
    }
    const places: TourPlace[] = [];
    rows.map((row: any) => {
      const place = new TourPlace(
        row.id,
        row.title,
        row.description,
        { longitude: row.longitude, latitude: row.latitude },
        row.district,
        row.categories,
        row.userId
      );
      places.push(place);
    });
    return places;
  }
}
