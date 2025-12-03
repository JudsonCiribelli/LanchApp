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

  it("should be able to create a new category if user is ADMIN", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .post("/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryName: "Special Pizzas",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("category");
    expect(response.body).toEqual({
      category: {
        id: expect.any(String),
        name: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it("should not create a new category with user doest ADMIN", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .post("/category")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryName: faker.lorem.lines() });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Only admins can register categories.",
    });
  });

  it("should not be able to create a duplicate category", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");
    const categoryName = "Cold Drinks";

    await supertest(server)
      .post("/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryName });

    const response = await supertest(server)
      .post("/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryName });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "This category is already exist",
    });
  });

  it("should not create a category with empty name", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .post("/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryName: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
    expect(JSON.stringify(response.body.issues)).toContain(
      "The name of category is required"
    );
  });

  it("should return 401 if no token is provided", async () => {
    const response = await supertest(server).post("/category").send({
      categoryName: "Tokenless Test",
    });

    expect(response.status).toBe(401);
  });
});
