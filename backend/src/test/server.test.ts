const app = require("../server");
const request = require("supertest");

describe("add function", () => {
  /*  test("should add two numbers correctly", () => {
    expect(add(1, 2)).toBe(3);
  });

  test("should return a negative number when adding a positive and a negative number", () => {
    expect(add(1, -2)).toBe(-1);
  });

  test("should return zero when adding zero and zero", () => {
    expect(add(0, 0)).toBe(0);
  });

  test("should return zero when adding zero and zero", () => {
    expect(add(0, 0)).toBe(0);
  }); */

  it("should return a welcome message on GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Welcome to the Node.js server!",
    });
  });
});
