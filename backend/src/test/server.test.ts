import request from "supertest"; // Import Supertest
import { startServer, stopServer } from "./testUtils";
import { App } from "supertest/types";

describe("Server", () => {
  let server: App;

  beforeAll(() => {
    server = startServer();
  });

  afterAll(() => {
    stopServer();
  });

  it("should return a health check message", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Server is running!");
  });
});
