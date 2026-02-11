import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import prismaClient from "../../lib/client.ts";
import { faker } from "@faker-js/faker";

describe("/category", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.category.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should get all created categories if user is ADMIN", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const category = await supertest(server)
      .post("/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryName: faker.lorem.words(1),
      });

    const response = await supertest(server)
      .get("/category")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual([
      {
        id: expect.any(String),
        name: expect.any(String),
        createdAt: expect.any(String),
        products: expect.any(Array),
      },
    ]);
    expect(response.status).toBe(200);
  });

  it("should not return categories with user doest ADMIN", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const category = await supertest(server)
      .post("/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryName: faker.lorem.words(1),
      });

    const response = await supertest(server)
      .get("/category")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Only admins can register categories.");
    expect(response.status).toBe(400);
  });

  it("should return 401 if no token is provided", async () => {
    const response = await supertest(server).get("/category").send({
      categoryName: "Tokenless Test",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Auth token is required");
  });
});
