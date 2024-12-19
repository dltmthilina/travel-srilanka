import request from "supertest"; // Import Supertest
import server from "../server"; // Import your server

describe("Server", () => {
  afterAll(() => {
    server.close(); // Close the server after tests to release the port
  });

  it("should return a health check message", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Server is running!");
  });
});
