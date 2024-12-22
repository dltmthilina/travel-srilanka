import request from "supertest";
import { startServer, stopServer } from "../testUtils";
import { App } from "supertest/types";

jest.mock("../../models/place"); // Mock the Place model to isolate controller logic
import TourPlace from "../../models/place";

describe("GET places/user/:uid", () => {
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

  it("should return an array of places if user ID is valid", async () => {
    const mockPlaces = [
      {
        id: 1,
        title: "sigiriya",
        description:
          "Sigiriya or Sinhagiri is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka",
        longitude: 7.9,
        latitude: 80.7, // Corrected spelling
        userId: 1,
      },
      {
        id: 2,
        title: "Ella",
        description:
          "Ella is a small town in the Badulla District of Uva Province, Sri Lanka governed by an Urban Council.",
        longitude: 7.9,
        latitude: 80.7, // Corrected spelling
        userId: 1,
      },
    ];

    (TourPlace.getPlacesByUid as jest.Mock).mockResolvedValue(mockPlaces);

    const response = await request(server).get("/places/user/1"); // Assuming endpoint fetches by user ID

    // Validate the response
    expect(response.status).toBe(200);
    expect(response.body.places).toEqual(mockPlaces); // Use toEqual for deep equality
    expect(TourPlace.getPlacesByUid).toHaveBeenCalledWith(1);
  });

  ///////////////////////////////////////////////////////////////////////////////////

  it("should return 400 if user id is invalid", async () => {
    const response = await request(server).get("/places/user/invalid");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid User Id");
    expect(TourPlace.getPlacesByUid).not.toHaveBeenCalled();
  });

  //////////////////////////////////////////////////////////////////////////////////////

  it("should return 404 if places are not found", async () => {
    (TourPlace.getPlacesByUid as jest.Mock).mockResolvedValue(null);
    const response = await request(server).get("/places/user/1");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not found places");
    expect(TourPlace.getPlacesByUid).toHaveBeenCalledWith(1);
  });

  //////////////////////////////////////////////////////////////////////////////////////////

  it("should return 500 if database connection error", async () => {
    (TourPlace.getPlacesByUid as jest.Mock).mockRejectedValue(
      new Error("Database connection error")
    );
    const response = await request(server).get("/places/user/1");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "An unexpected error occurred. Please try again later."
    );
    expect(TourPlace.getPlacesByUid).toHaveBeenCalledWith(1);
  });
});
