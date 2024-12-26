"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest")); // Import Supertest
const testUtils_1 = require("./testUtils");
describe("Server", () => {
    let server;
    beforeAll(() => {
        server = (0, testUtils_1.startServer)();
    });
    afterAll(() => {
        (0, testUtils_1.stopServer)();
    });
    it("should return a health check message", async () => {
        const response = await (0, supertest_1.default)(server).get("/");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Server is running!");
    });
});
