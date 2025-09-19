const request = require("supertest");
const app = require("../server");

describe("API Tests", () => {
  it("GET / should return API running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Node.js Express API is running");
  });

  it("GET /api/tasks should return tasks", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
