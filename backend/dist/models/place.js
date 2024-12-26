"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
class TourPlace {
    constructor(id, title, description, location, district, categories, userId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.district = district;
        this.categories = categories;
        this.userId = userId;
    }
    async createPlace() {
        const query = "INSERT INTO places (title, description, longitude, latitude,district, userId ) VALUES (?, ?, ?, ?, ?, ?)";
        let result1;
        try {
            const [result] = await database_1.default.execute(query, [
                this.title,
                this.description,
                this.location.longitude,
                this.location.latitude,
                this.district,
                this.userId,
            ]);
            result1 = result;
        }
        catch (error) {
            throw new Error("Database query failed");
        }
        const placeId = result1.insertId;
        for (const categoryId of this.categories) {
            await database_1.default.execute(`INSERT INTO place_categories (place_id, category_id) VALUES (?, ?)`, [placeId, categoryId]);
        }
        return result1;
    }
    static async getPlaceById(placeId) {
        const connection = await database_1.default.getConnection();
        try {
            const query = "SELECT * FROM places WHERE id = ?";
            const query2 = "SELECT category_id FROM place_categories WHERE place_id = ?";
            const [rows] = await connection.execute(query, [
                placeId,
            ]);
            if (rows.length === 0) {
                await connection.rollback();
                connection.release();
                return null;
            }
            const [categories] = await connection.execute(query2, [placeId]);
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
            return new TourPlace(row.id, row.title, row.description, { longitude: row.longitude, latitude: row.latitude }, row.district, placeCat, row.userId);
        }
        catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    static async updatePlace(data) {
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            const query = `UPDATE places 
               SET title = COALESCE(?, title), 
                   description = COALESCE(?, description), 
                   longitude = COALESCE(?, longitude), 
                   latitude = COALESCE(?, latitude),
                   district = COALESCE(?, district)
               WHERE id = ?`;
            const [results] = await connection.execute(query, [
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
                await connection.execute(`DELETE FROM place_categories WHERE place_id = ?`, [data.id]);
                for (const categoryId of categories) {
                    const [categoryResult] = await connection.execute(`INSERT INTO place_categories (place_id, category_id) VALUES (?, ?)`, [data.id ?? null, categoryId ?? null]);
                    if (categoryResult.affectedRows === 0) {
                        await connection.rollback();
                        connection.release();
                        return null;
                    }
                }
            }
            await connection.commit(); // Commit transaction if everything succeeds
            connection.release();
            return new TourPlace(data.id, data.title, data.description, {
                longitude: data.location.longitude,
                latitude: data.location.latitude,
            }, data.district, data.categories, data.userId);
        }
        catch (error) {
            await connection.rollback(); // Rollback transaction on error
            connection.release(); // Release connection
            throw error;
        }
    }
    static async deletePlace(placeId) {
        const query = `DELETE FROM places WHERE id = ?`;
        const [result] = await database_1.default.execute(query, [placeId]);
        return result;
    }
    static async getPlacesByUid(userId) {
        const query = `SELECT * FROM places WHERE userId = ?`;
        const [rows] = await database_1.default.execute(query, [userId]);
        if (rows.length === 0) {
            return null;
        }
        const places = [];
        rows.map((row) => {
            const place = new TourPlace(row.id, row.title, row.description, { longitude: row.longitude, latitude: row.latitude }, row.district, row.categories, row.userId);
            places.push(place);
        });
        return places;
    }
}
exports.default = TourPlace;
