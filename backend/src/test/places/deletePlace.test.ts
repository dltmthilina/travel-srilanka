import request from "supertest";
import { startServer, stopServer } from "../testUtils";
import { App } from "supertest/types";

jest.mock("../../models/place"); // Mock the Place model to isolate controller logic
import TourPlace from "../../models/place";

describe("DELETE /places:pid", () => {
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

  it("should delete place if id is valid", async () => {
    const mockExistingPlace = {
      id: 1,
      title: "Old Place Title",
      description: "Old description",
      longitude: 80.1234,
      latitude: 6.789,
      userId: 1,
    };
    (TourPlace.getPlaceById as jest.Mock).mockResolvedValue(mockExistingPlace);
    (TourPlace.deletePlace as jest.Mock).mockResolvedValue({
      affectedRows: 1,
    });
    const response = await request(server).delete("/places/1");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Place deleted successfully!");
    expect(TourPlace.deletePlace).toHaveBeenCalledWith(1);
  });

  /////////////////////////////////////////////////////////////////////

  it("should return 400 if place is invalid", async () => {
    const response = await request(server).delete("/places/invalidId");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid place ID");
    expect(TourPlace.deletePlace).not.toHaveBeenCalled();
  });

  /////////////////////////////////////////////////////////////////////
  it("should return 404 if the place does not exist", async () => {
    (TourPlace.getPlaceById as jest.Mock).mockResolvedValue(null);
    const response = await request(server).delete("/places/10");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Place not found");
    expect(TourPlace.deletePlace).not.toHaveBeenCalled();
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
    (TourPlace.getPlaceById as jest.Mock).mockResolvedValue(mockExistingPlace);
    (TourPlace.deletePlace as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    const response = await request(server).delete("/places/1");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "An unexpected error occurred. Please try again later."
    );
    expect(TourPlace.deletePlace).toHaveBeenCalled();
  });
});
