import { ResultSetHeader } from "mysql2";
import db from "../db/sql_con";

interface Location {
  longitude: number;
  latitude: number;
}

interface PlaceAttributes {
  id: number | null;
  title: string;
  description: string;
  location: Location;
  district: string;
  categories: number[];
  userId: number;
}

export default class TourPlace implements PlaceAttributes {
  constructor(
    id: number | null,
    title: string,
    description: string,
    location: Location,
    district: string,
    categories: number[],
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
  location: Location;
  district: string;
  categories: number[];
  userId: number;

  async createPlace(): Promise<ResultSetHeader> {
    const query =
      "INSERT INTO places (title, description, longitude, latitude,district, userId ) VALUES (?, ?, ?, ?, ?, ?)";
    let result1;
    try {
      const [result] = await db.execute<ResultSetHeader>(query, [
        this.title,
        this.description,
        this.location.longitude,
        this.location.latitude,
        this.district,
        this.userId,
      ]);
      result1 = result;
    } catch (error) {
      throw new Error("Database query failed");
    }

    const placeId = result1.insertId;

    for (const categoryId of this.categories) {
      await db.execute(
        `INSERT INTO place_categories (place_id, category_id) VALUES (?, ?)`,
        [placeId, categoryId]
      );
    }
    return result1;
  }

  static async getPlaceById(placeId: number): Promise<TourPlace | null> {
    const connection = await db.getConnection();
    try {
      const query = "SELECT * FROM places WHERE id = ?";
      const query2 =
        "SELECT category_id FROM place_categories WHERE place_id = ?";
      const [rows]: any[] = await connection.execute<ResultSetHeader>(query, [
        placeId,
      ]);

      if (rows.length === 0) {
        await connection.rollback();
        connection.release();
        return null;
      }

      const [categories]: any[] = await connection.execute<ResultSetHeader>(
        query2,
        [placeId]
      );

      if (categories.length === 0) {
        await connection.rollback();
        connection.release();
        return null;
      }
      const row = rows[0];

      let placeCat = [];
      for (const cat of categories) {
        placeCat.push(cat.category_id);
      }

      return new TourPlace(
        row.id,
        row.title,
        row.description,
        { longitude: row.longitude, latitude: row.latitude },
        row.district,
        placeCat,
        row.userId
      );
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  static async updatePlace(data: any): Promise<TourPlace | null> {
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

      const [results] = await connection.execute<ResultSetHeader>(query, [
        data.title ?? null,
        data.description ?? null,
        data.location?.longitude ?? null,
        data.location?.latitude ?? null,
        data.district ?? null,
        data.id ?? null,
      ]);

      if (results.affectedRows === 0) {
        await connection.rollback(); // Rollback transaction
        connection.release(); // Release connection
        return null;
      }

      const categories = data.categories ?? [];

      if (Array.isArray(categories) && categories.length > 0) {
        await connection.execute(
          `DELETE FROM place_categories WHERE place_id = ?`,
          [data.id]
        );
        for (const categoryId of categories) {
          const [categoryResult] = await connection.execute<ResultSetHeader>(
            `INSERT INTO place_categories (place_id, category_id) VALUES (?, ?)`,
            [data.id ?? null, categoryId ?? null]
          );

          if (categoryResult.affectedRows === 0) {
            await connection.rollback();
            connection.release();
            return null;
          }
        }
      }
      await connection.commit(); // Commit transaction if everything succeeds
      connection.release();

      return new TourPlace(
        data.id,
        data.title,
        data.description,
        {
          longitude: data.location.longitude,
          latitude: data.location.latitude,
        },
        data.district,
        data.categories,
        data.userId
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
