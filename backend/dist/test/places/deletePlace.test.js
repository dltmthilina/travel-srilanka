"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testUtils_1 = require("../testUtils");
jest.mock("../../models/place"); // Mock the Place model to isolate controller logic
const place_1 = __importDefault(require("../../models/place"));
describe("DELETE /places:pid", () => {
    let server;
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });
    beforeAll(() => {
        server = (0, testUtils_1.startServer)();
    });
    afterAll(() => {
        (0, testUtils_1.stopServer)();
    });
    it("should delete place if id is valid", async () => {
        const mockExistingPlace = {
            id: 1,
            title: "Old Place Title",
            description: "Old description",
            longitude: 80.1234,
            latitude: 6.789,
            userId: 1,
        };
        place_1.default.getPlaceById.mockResolvedValue(mockExistingPlace);
        place_1.default.deletePlace.mockResolvedValue({
            affectedRows: 1,
        });
        const response = await (0, supertest_1.default)(server).delete("/places/1");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Place deleted successfully!");
        expect(place_1.default.deletePlace).toHaveBeenCalledWith(1);
    });
    /////////////////////////////////////////////////////////////////////
    it("should return 400 if place is invalid", async () => {
        const response = await (0, supertest_1.default)(server).delete("/places/invalidId");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid place ID");
        expect(place_1.default.deletePlace).not.toHaveBeenCalled();
    });
    /////////////////////////////////////////////////////////////////////
    it("should return 404 if the place does not exist", async () => {
        place_1.default.getPlaceById.mockResolvedValue(null);
        const response = await (0, supertest_1.default)(server).delete("/places/10");
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Place not found");
        expect(place_1.default.deletePlace).not.toHaveBeenCalled();
    });
    /////////////////////////////////////////////////////////////////////
    it("should return 500 and appropriate error message if an error occurs", async () => {
        const mockExistingPlace = {
            id: 1,
            title: "Old Place Title",
            description: "Old description",
            longitude: 80.1234,
            latitude: 6.789,
            userId: 1,
        };
        place_1.default.getPlaceById.mockResolvedValue(mockExistingPlace);
        place_1.default.deletePlace.mockRejectedValue(new Error("Database connection failed"));
        const response = await (0, supertest_1.default)(server).delete("/places/1");
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("An unexpected error occurred. Please try again later.");
        expect(place_1.default.deletePlace).toHaveBeenCalled();
    });
});
