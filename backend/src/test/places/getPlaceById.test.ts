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
});
