import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import { server } from "../../server.ts";

describe("/PRODUCT", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.product.deleteMany();
    await prismaClient.category.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should create a new product", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const category = await prismaClient.category.create({
      data: {
        name: faker.lorem.lines(1),
      },
    });

    const imageBuffer = Buffer.from("image-fake");

    const response = await supertest(server)
      .post("/product")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Coca Cola 2L")
      .field("price", "12.90")
      .field("description", "Refrigerante Gelado")
      .field("categoryId", category.id)
      .attach("file", imageBuffer, "teste.png");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("product");
    expect(response.body).toEqual({
      product: {
        id: expect.any(String),
        categoryId: expect.any(String),
        name: expect.any(String),
        price: expect.any(String),
        description: expect.any(String),
        banner: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
    expect(response.body.product.banner).toEqual(expect.any(String));
  });

  it("should NOT create a product without an image file", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const category = await prismaClient.category.create({
      data: { name: "Lanches" },
    });

    const response = await supertest(server)
      .post("/product")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "X-Bacon")
      .field("price", "25.00")
      .field("description", "Bacon extra")
      .field("categoryId", category.id);

    expect(response.status).toBe(400);
  });

  it("should NOT create a product with missing text fields (Zod)", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");
    const imageBuffer = Buffer.from("imagem");

    const response = await supertest(server)
      .post("/product")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", imageBuffer, "teste.png")
      .field("description", "Apenas descrição");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
  });
});
