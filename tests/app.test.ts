import app from "../src/app";
import request from "supertest";

describe("GET /api/health", () => {
  it('responds with "Server is healthy!', async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.text).toBe(
      "Server is healthy!"
    );
  });
});
