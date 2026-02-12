import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import { faker } from "@faker-js/faker";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";

describe("GET/CATEGORY/PRODUCT", () => {
  it("Should return products from a category", async () => {
    beforeAll(async () => {});

    afterAll(async () => {
      await prismaClient.product.deleteMany();
      await prismaClient.category.deleteMany();
      await prismaClient.user.deleteMany();
      await prismaClient.$disconnect();
    });

    const { token } = await makeAuthenticatedUser("CLIENT");

    const category = await prismaClient.category.create({
      data: {
        name: faker.lorem.lines(1),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const product = await prismaClient.product.create({
      data: {
        name: "Café Expresso",
        price: "5.00",
        description: "Café forte",
        banner: "cafe.png",
        categoryId: category.id,
      },
    });

    const response = await supertest(server)
      .get("/category/product")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({
        categoryId: category.id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("category");
    expect(response.body).toEqual({
      category: [
        {
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(String),
          description: expect.any(String),
          banner: expect.any(String),
          categoryId: expect.any(String),
          createdAt: expect.any(String),
          category: {
            id: expect.any(String),
            name: expect.any(String),
          },
        },
      ],
    });
  });

  it("should return 400 if categoryId is missing", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .get("/category/product")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Category ID is required" });
  });
});
