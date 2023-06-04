import app from '../server/index';
import request from "supertest";

describe("Miscellaneous Tests", () => {
    it("should return status code 404 when accessing non-existant route.", async () => {
        const res = await request(app).get("/api/v1/nonexistant")

        expect(res.statusCode).toBe(404)
    });

    it("should return status code 429 after sending 30 requests in 2 seconds.", async () => {
        await Promise.all([...Array(30).keys()].map(i => request(app).get('/api/v1/nonexistant')))

        const res = await request(app).get("/api/v1/nonexistant")
        expect(res.statusCode).toBe(429)
    });
});