import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { faker } from "@faker-js/faker";
import supertest from "supertest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import { server } from "../../server.ts";

vi.mock("../../config/cloudinary", () => {
  return {
    default: {
      uploader: {
        upload_stream: vi.fn((options, callback) => {
          callback(null, {
            secure_url: "https://fake-url.com/image.jpg",
            public_id: "fake_id",
          });
          return { write: vi.fn(), end: vi.fn(), on: vi.fn(), emit: vi.fn() };
        }),
      },
    },
  };
});

describe("DELETE /product", () => {
  beforeAll(async () => {
    await prismaClient.product.deleteMany();
    await prismaClient.category.deleteMany();
    await prismaClient.user.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.product.deleteMany();
    await prismaClient.category.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  async function createProductInDb() {
    const category = await prismaClient.category.create({
      data: { name: faker.commerce.department() + Date.now() },
    });

    const product = await prismaClient.product.create({
      data: {
        name: faker.commerce.productName().toUpperCase(),
        price: "20.00",
        description: "Descrição teste",
        banner: "http://image.com",
        categoryId: category.id,
      },
    });

    return { product, category };
  }

  it("should delete a product successfully (ADMIN)", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const { product } = await createProductInDb();

    const response = await supertest(server)
      .delete("/product")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: product.id });

    expect(response.status).toBe(200);

    const productInDb = await prismaClient.product.findUnique({
      where: { id: product.id },
    });
    expect(productInDb).toBeNull();
  });

  it("should NOT delete a product if user is CLIENT", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const { product } = await createProductInDb();

    const response = await supertest(server)
      .delete("/product")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: product.id });

    expect(response.status).toBe(400);
  });

  it("should return 400 if productId is missing or invalid", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .delete("/product")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: "" });

    expect(response.status).toBe(400);

    const issues = JSON.stringify(response.body.issues || response.body);
    expect(issues).toContain("UUID");
  });
});
