import app from '../server/index';
import request from "supertest";

describe("Miscellaneous Tests", () => {
    test("Get non-existant route.", async () => {
        const res = await request(app).get("/api/v1/nonexistant")

        expect(res.statusCode).toBe(404)
    });
});