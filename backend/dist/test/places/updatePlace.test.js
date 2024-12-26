"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testUtils_1 = require("../testUtils");
jest.mock("../../models/place"); // Mock the Place model to isolate controller logic
const place_1 = __importDefault(require("../../models/place"));
const districts_enum_1 = require("../../utils/districts.enum");
describe("PUT /places/pid", () => {
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
    ///////////////////////////////////////////////////////////////////////////////////////////////
    it("should update a place with valid data", async () => {
        const mockPlaceId = 1;
        const mockExistingPlace = new place_1.default(mockPlaceId, "Old Place Title", "Old description", { longitude: 80.1234, latitude: 6.789 }, "", [], 1);
        const mockUpdatedData = {
            title: "New Place Title",
            description: "New description",
            location: { longitude: 80.9876, latitude: 7.123 },
            district: districts_enum_1.Districts.Ampara,
            categories: [1, 2],
        };
        const mockUpdatedPlace = {
            id: mockPlaceId,
            title: "New Place Title",
            description: "New description",
            location: { longitude: 80.9876, latitude: 7.123 },
            district: "Ampara",
            categories: [1, 2],
            userId: 1,
        };
        place_1.default.getPlaceById.mockResolvedValue(mockExistingPlace);
        place_1.default.updatePlace.mockResolvedValue(mockUpdatedPlace);
        const response = await (0, supertest_1.default)(server)
            .put(`/places/${mockPlaceId}`)
            .send(mockUpdatedData);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Place updated successfully!");
        expect(JSON.stringify(response.body.updatedPlace)).toEqual(JSON.stringify(mockUpdatedPlace));
        expect(place_1.default.getPlaceById).toHaveBeenCalledWith(mockPlaceId);
        expect(place_1.default.updatePlace).toHaveBeenCalled();
    });
    /////////////////////////////////////////////////////////////////////////////////////
    it("should return 404 if the place does not exist", async () => {
        const mockPlaceId = 10;
        const mockUpdatedData = {
            title: "New Place Title",
            description: "New description",
            longitude: 80.9876,
            latitude: 7.123,
        };
        place_1.default.getPlaceById.mockResolvedValue(null);
        const response = await (0, supertest_1.default)(server)
            .put(`/places/${mockPlaceId}`)
            .send(mockUpdatedData);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Place not found");
        expect(place_1.default.updatePlace).not.toHaveBeenCalled();
    });
    ///////////////////////////////////////////////////////////////////////////////////////
    it("should return 400 for invalid data", async () => {
        const mockPlaceId = 1;
        const mockExistingPlace = {
            id: mockPlaceId,
            title: "Old Place Title",
            description: "Old description",
            longitude: 80.1234,
            latitude: 6.789,
            userId: 1,
        };
        const mockUpdatedData = {
            title: 254,
            description: "New description",
            longitude: 80.9876,
            latitude: 7.123,
        };
        place_1.default.getPlaceById.mockResolvedValue(mockExistingPlace);
        const response = await (0, supertest_1.default)(server)
            .put(`/places/${mockPlaceId}`)
            .send(mockUpdatedData);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid inputs, please check your data");
        expect(place_1.default.updatePlace).not.toHaveBeenCalled();
    });
    /////////////////////////////////////////////////////////////////////
    it("should return 500 and appropriate error message if an error occurs", async () => {
        const mockPlaceId = 1;
        const mockExistingPlace = {
            id: mockPlaceId,
            title: "Old Place Title",
            description: "Old description",
            longitude: 80.1234,
            latitude: 6.789,
            userId: 1,
        };
        const mockUpdatedData = {
            title: "New Place Title",
            description: "New description",
            location: { longitude: 80.9876, latitude: 7.123 },
        };
        place_1.default.getPlaceById.mockResolvedValue(mockExistingPlace);
        place_1.default.updatePlace.mockRejectedValue(new Error("Database connection failed"));
        const response = await (0, supertest_1.default)(server)
            .put(`/places/${mockPlaceId}`)
            .send(mockUpdatedData);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("An unexpected error occurred. Please try again later.");
        expect(place_1.default.updatePlace).toHaveBeenCalled();
    });
});
