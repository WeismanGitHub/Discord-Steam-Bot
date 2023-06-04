import app from '../server/index';
import request from "supertest";

describe("Posts API Tests", () => {
    describe("GET /api/v1/posts", () => {
        it("should return an array of posts", async () => {
            const res = await request(app).get("/api/v1/posts").query({ page: 0 })
            
            expect(res.statusCode).toBe(200)
            expect(res.body.length).toBeLessThanOrEqual(10)
    
            for (let post of res.body) {
                expect(post).toHaveProperty('_id')
                expect(post).toHaveProperty('text')
                expect(post).toHaveProperty('title')
                expect(post).toHaveProperty('createdAt')
            }
        });

        it("should return status code 400", async () => {
            const res = await request(app).get("/api/v1/posts")
            .query({ page: -1 })
            
            expect(res.statusCode).toBe(400)
        });
    })

    describe("POST /api/v1/posts", () => {
    })
});