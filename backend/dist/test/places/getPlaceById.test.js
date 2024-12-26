"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testUtils_1 = require("../testUtils");
jest.mock("../../models/place"); // Mock the Place model to isolate controller logic
const place_1 = __importDefault(require("../../models/place"));
describe("GET /places/:pid", () => {
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
    it("should return a place if id is valid", async () => {
        place_1.default.getPlaceById.mockResolvedValue({
            id: 1,
            title: "sigiriya",
            description: "Sigiriya or Sinhagiri is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka",
            longitude: 7.9,
            latittude: 80.7,
            userId: 1,
        });
        const response = await (0, supertest_1.default)(server).get("/places/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", 1);
        expect(place_1.default.getPlaceById).toHaveBeenCalledWith(1);
    });
    it("should return 404 if the place is not found", async () => {
        place_1.default.getPlaceById.mockResolvedValue(null);
        const response = await (0, supertest_1.default)(server).get("/places/10");
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Place not found");
        expect(place_1.default.getPlaceById).toHaveBeenCalledWith(10);
    });
    it("should return 400 if the id is invalid", async () => {
        const response = await (0, supertest_1.default)(server).get("/places/invalid");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid place ID");
        expect(place_1.default.getPlaceById).not.toHaveBeenCalled();
    });
    it("should return 500 and appropriate error message if an error occurs", async () => {
        place_1.default.getPlaceById.mockRejectedValue(new Error("Database connection failed"));
        const response = await (0, supertest_1.default)(server).get("/places/1");
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("An unexpected error occurred. Please try again later.");
        expect(place_1.default.getPlaceById).toHaveBeenCalledWith(1);
    });
});
