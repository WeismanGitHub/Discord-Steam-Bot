import app from '../server/index';
import request from "supertest";

describe("Miscellaneous Tests", () => {
    it("should return status code 404 when accessing non-existant route.", async () => {
        const res = await request(app).get("/api/v1/nonexistant")

        expect(res.statusCode).toBe(404)
    });
});