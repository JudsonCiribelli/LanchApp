import supertest from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { server } from "../../server.ts";
import prismaClient from "../../lib/client.ts";
import { faker } from "@faker-js/faker";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";

describe("/PRODUCT", () => {
  it("should return all products", async () => {
    afterAll(async () => {
      await prismaClient.product.deleteMany();
      await prismaClient.category.deleteMany();
      await prismaClient.user.deleteMany();
      await prismaClient.$disconnect();
    });

    const { token } = await makeAuthenticatedUser("CLIENT");

    const category = await prismaClient.category.create({
      data: { name: faker.lorem.lines(1) },
    });

    await prismaClient.product.create({
      data: {
        name: faker.lorem.lines(1),
        price: "8.00",
        description: "Natural",
        banner: "suco.png",
        categoryId: category.id,
      },
    });

    await prismaClient.product.create({
      data: {
        name: faker.lorem.lines(1),
        price: "3.00",
        description: "Sem gás",
        banner: "agua.png",
        categoryId: category.id,
      },
    });

    const response = await supertest(server)
      .get("/product")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should return empty list if no products exist", async () => {
    await prismaClient.product.deleteMany();

    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .get("/product")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.products).toEqual([]);
  });
});
