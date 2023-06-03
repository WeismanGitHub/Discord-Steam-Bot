import app from '../server/index';
import request from "supertest";

describe("Posts API Tests", () => {
    test("GET /api/v1/posts", async () => {
        const res = await request(app).get("/api/v1/posts")
        
        expect(res.body)
    });

    describe("POST /api/v1/posts", () => {
    })
});