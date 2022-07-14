import { hash } from "bcrypt";
import request from "supertest";
import { DataSource } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;
let adminToken: string;

describe("Create Category Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash("admin", 8);

        await connection.query(
            `
            INSERT INTO users (id, name, email, password, "isAdmin", created_at, driver_license)
            VALUES ('${id}', 'admin', 'admin@admin.com.br', '${password}', true, 'now()', 'XXXXXX')
            `
        );

        const responseToken = await request(app).post("/sessions").send({
            email: "admin@admin.com.br",
            password: "admin",
        });

        adminToken = responseToken.body.token;
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.destroy();
    });

    it("should be able to create a new category", async () => {
        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Supertest",
                description: "Category Supertest description",
            })
            .set({
                Authorization: `Bearer ${adminToken}`,
            });

        expect(response.status).toBe(201);
    });

    it("should not be able to create a new category with name exists", async () => {
        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Supertest",
                description: "Category Supertest description",
            })
            .set({
                Authorization: `Bearer ${adminToken}`,
            });

        expect(response.status).toBe(400);
    });
});
