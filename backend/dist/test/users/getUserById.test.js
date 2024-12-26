"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testUtils_1 = require("../testUtils");
jest.mock("../../models/user");
const user_1 = __importDefault(require("../../models/user"));
describe("GET /:uid ", () => {
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
    it("should return a user if the ID is valid", async () => {
        user_1.default.getById.mockResolvedValue({
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            country: "USA",
            imageUrl: "http://example.com/image.jpg",
        });
        const response = await (0, supertest_1.default)(server).get("/users/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", 1);
        expect(user_1.default.getById).toHaveBeenCalledWith(1);
    });
    it("should return 404 if the user is not found", async () => {
        user_1.default.getById = jest.fn().mockResolvedValue({});
        user_1.default.getById.mockResolvedValue(null);
        const response = await (0, supertest_1.default)(server).get(`/users/10`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
        expect(user_1.default.getById).toHaveBeenCalledWith(10);
    });
    it("should return 400 for invalid user ID", async () => {
        const response = await (0, supertest_1.default)(server).get("/users/invalid-id");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid user ID");
        expect(user_1.default.getById).not.toHaveBeenCalled();
    });
});
