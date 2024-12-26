import request from "supertest";
import { startServer, stopServer } from "../testUtils";
import { App } from "supertest/types";

jest.mock("../../models/place"); // Mock the Place model to isolate controller logic
import TourPlace from "../../models/place";
import { Districts } from "../../utils/districts.enum";

describe("PUT /places/pid", () => {
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

  ///////////////////////////////////////////////////////////////////////////////////////////////

  it("should update a place with valid data", async () => {
    const mockPlaceId = 1;
    const mockExistingPlace = new TourPlace(
      mockPlaceId,
      "Old Place Title",
      "Old description",
      { longitude: 80.1234, latitude: 6.789 },
      "",
      [],
      1
    );

    const mockUpdatedData = {
      title: "New Place Title",
      description: "New description",
      location: { longitude: 80.9876, latitude: 7.123 },
      district: Districts.Ampara,
      categories: [1, 2],
    };

    const mockUpdatedPlace = {
      id: mockPlaceId,
      title: "New Place Title",
      description: "New description",
      location: { longitude: 80.9876, latitude: 7.123 },
      district: "Ampara",
      categories: [1, 2],
      userId: 1,
    };

    (TourPlace.getPlaceById as jest.Mock).mockResolvedValue(mockExistingPlace);
    (TourPlace.updatePlace as jest.Mock).mockResolvedValue(mockUpdatedPlace);

    const response = await request(server)
      .put(`/places/${mockPlaceId}`)
      .send(mockUpdatedData);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe("Place updated successfully!");
    expect(JSON.stringify(response.body.updatedPlace)).toEqual(
      JSON.stringify(mockUpdatedPlace)
    );
    expect(TourPlace.getPlaceById).toHaveBeenCalledWith(mockPlaceId);
    expect(TourPlace.updatePlace).toHaveBeenCalled();
  });

  /////////////////////////////////////////////////////////////////////////////////////

  it("should return 404 if the place does not exist", async () => {
    const mockPlaceId = 10;

    const mockUpdatedData = {
      title: "New Place Title",
      description: "New description",
      longitude: 80.9876,
      latitude: 7.123,
    };
    (TourPlace.getPlaceById as jest.Mock).mockResolvedValue(null);
    const response = await request(server)
      .put(`/places/${mockPlaceId}`)
      .send(mockUpdatedData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Place not found");
    expect(TourPlace.updatePlace).not.toHaveBeenCalled();
  });

  ///////////////////////////////////////////////////////////////////////////////////////

  it("should return 400 for invalid data", async () => {
    const mockPlaceId = 1;
    const mockExistingPlace = {
      id: mockPlaceId,
      title: "Old Place Title",
      description: "Old description",
      longitude: 80.1234,
      latitude: 6.789,
      userId: 1,
    };
    const mockUpdatedData = {
      title: 254,
      description: "New description",
      longitude: 80.9876,
      latitude: 7.123,
    };
    (TourPlace.getPlaceById as jest.Mock).mockResolvedValue(mockExistingPlace);

    const response = await request(server)
      .put(`/places/${mockPlaceId}`)
      .send(mockUpdatedData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Invalid inputs, please check your data"
    );
    expect(TourPlace.updatePlace).not.toHaveBeenCalled();
  });

  /////////////////////////////////////////////////////////////////////

  it("should return 500 and appropriate error message if an error occurs", async () => {
    const mockPlaceId = 1;
    const mockExistingPlace = {
      id: mockPlaceId,
      title: "Old Place Title",
      description: "Old description",
      longitude: 80.1234,
      latitude: 6.789,
      userId: 1,
    };

    const mockUpdatedData = {
      title: "New Place Title",
      description: "New description",
      location: { longitude: 80.9876, latitude: 7.123 },
    };

    (TourPlace.getPlaceById as jest.Mock).mockResolvedValue(mockExistingPlace);
    (TourPlace.updatePlace as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    const response = await request(server)
      .put(`/places/${mockPlaceId}`)
      .send(mockUpdatedData);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "An unexpected error occurred. Please try again later."
    );
    expect(TourPlace.updatePlace).toHaveBeenCalled();
  });
});
