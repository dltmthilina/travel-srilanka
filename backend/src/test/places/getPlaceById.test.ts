import request from "supertest";
import { startServer, stopServer } from "../testUtils";
import { App } from "supertest/types";

jest.mock("../../models/place"); // Mock the Place model to isolate controller logic
import TourPlace from "../../models/place";

describe("GET /places/:pid", () => {
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

  it("should return a place if id is valid", async () => {
    (TourPlace.getPlaceById as jest.Mock).mockResolvedValue({
      id: 1,
      title: "sigiriya",
      description:
        "Sigiriya or Sinhagiri is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka",
      longitude: 7.9,
      latittude: 80.7,
      userId: 1,
    });

    const response = await request(server).get("/places/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(TourPlace.getPlaceById).toHaveBeenCalledWith(1);
  });

  it("should return 404 if the place is not found", async () => {
    (TourPlace.getPlaceById as jest.Mock).mockResolvedValue(null);
    const response = await request(server).get("/places/10");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Place not found");
    expect(TourPlace.getPlaceById).toHaveBeenCalledWith(10);
  });

  it("should return 400 if the id is invalid", async () => {
    const response = await request(server).get("/places/invalid");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid place ID");
    expect(TourPlace.getPlaceById).not.toHaveBeenCalled();
  });

  it("should return 500 and appropriate error message if an error occurs", async () => {
    (TourPlace.getPlaceById as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );
    const response = await request(server).get("/places/1");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "An unexpected error occurred. Please try again later."
    );
    expect(TourPlace.getPlaceById).toHaveBeenCalledWith(1);
  });
});
