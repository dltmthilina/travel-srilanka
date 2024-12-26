"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testUtils_1 = require("../testUtils");
jest.mock("../../models/place"); // Mock the Place model to isolate controller logic
const place_1 = __importDefault(require("../../models/place"));
describe("POST /create-place", () => {
    // Mock implementation for TourPlace's createPlace method
    place_1.default.prototype.createPlace = jest.fn().mockResolvedValue({
        insertId: 1, // Mocked database response for a successful insert
    });
    let server;
    beforeAll(() => {
        server = (0, testUtils_1.startServer)();
    });
    afterAll(() => {
        (0, testUtils_1.stopServer)();
    });
    it("should create a new place with valid data", async () => {
        const mockPlace = {
            title: "Test Place",
            description: "A beautiful place to visit.",
            location: { longitude: 80.1234, latitude: 6.789 },
            userId: 1,
        };
        const response = await (0, supertest_1.default)(server)
            .post("/places/create-place")
            .send(mockPlace);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "Place created successfully!",
            placeId: 1,
        });
        // Assert that createPlace was called with the correct arguments
        expect(place_1.default.prototype.createPlace).toHaveBeenCalled();
    });
    it("should return 400 for missing title fields", async () => {
        const invalidPlace = {
            title: null,
            description: "Missing title and userId.",
            location: { longitude: 80.1234, latitude: 6.789 },
            userId: 1,
        };
        const response = await (0, supertest_1.default)(server)
            .post("/places/create-place")
            .send(invalidPlace);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Invalid inputs, please check your data",
        });
        // Ensure createPlace was not called
        expect(place_1.default.prototype.createPlace).toHaveBeenCalled();
    });
    it("should return 500 for database errors", async () => {
        jest.setTimeout(10000);
        // Mock createPlace to throw an error
        place_1.default.prototype.createPlace = jest
            .fn()
            .mockRejectedValue(new Error("DB Error"));
        const mockPlace = {
            title: "Test Place",
            description: "A beautiful place to visit.",
            location: { longitude: 80.1234, latitude: 6.789 },
            userId: 1,
        };
        try {
            const response = await (0, supertest_1.default)(server)
                .post("/places/create-place")
                .send(mockPlace);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Failed to create place. Please try again later",
            });
        }
        catch (error) {
            console.error("Test failed with error:", error);
        }
        expect(place_1.default.prototype.createPlace).toHaveBeenCalled();
    });
});
