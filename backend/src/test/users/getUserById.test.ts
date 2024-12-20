import request from "supertest";
import { startServer, stopServer } from "../testUtils";
import { App } from "supertest/types";

jest.mock("../../models/user");
import Tourist from "../../models/user";

describe("GET /:uid ", () => {
  let server: App;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  beforeAll(() => {
    server = startServer();
  });

  afterAll(() => {
    stopServer();
  });

  it("should return a user if the ID is valid", async () => {
    (Tourist.getById as jest.Mock).mockResolvedValue({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
      imageUrl: "http://example.com/image.jpg",
    });

    const response = await request(server).get("/users/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(Tourist.getById).toHaveBeenCalledWith(1);
  });

  it("should return 404 if the user is not found", async () => {
    Tourist.getById = jest.fn().mockResolvedValue({});
    (Tourist.getById as jest.Mock).mockResolvedValue(null);
    const response = await request(server).get(`/users/10`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
    expect(Tourist.getById).toHaveBeenCalledWith(10);
  });
  it("should return 400 for invalid user ID", async () => {
    const response = await request(server).get("/users/invalid-id");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid user ID");
    expect(Tourist.getById).not.toHaveBeenCalled();
  });
});
