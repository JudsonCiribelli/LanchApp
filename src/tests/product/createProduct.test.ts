import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import { server } from "../../server.ts";

vi.mock("../../config/cloudinary", () => {
  return {
    default: {
      uploader: {
        upload_stream: vi.fn((options, callback) => {
          callback(null, {
            secure_url:
              "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            public_id: "sample_id",
          });

          return {
            write: vi.fn(),
            end: vi.fn(),
            on: vi.fn(),
            once: vi.fn(),
            emit: vi.fn(),
          };
        }),
      },
    },
  };
});
describe("POST/product", () => {
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

  it("should create a new product successfully", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const category = await prismaClient.category.create({
      data: {
        name: faker.commerce.department() + " " + Date.now(),
      },
    });

    const imageBuffer = Buffer.from("fake-image-content");

    const response = await supertest(server)
      .post("/product")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Coca Cola 3L")
      .field("price", "15.90")
      .field("description", "Refrigerante Família")
      .field("categoryId", category.id)
      .attach("file", imageBuffer, "coca.png");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("product");
    expect(response.body.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        categoryId: category.id,
        name: "COCA COLA 3L",
        price: "15.90",
        description: "Refrigerante Família",
        banner: expect.stringContaining("http"),
        createdAt: expect.any(String),

        category: expect.objectContaining({
          id: category.id,
          name: expect.any(String),
        }),
      }),
    );
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

  it("should not create a product with user is (CLIENT)", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");
    const imageBuffer = Buffer.from("imagem");

    const response = await supertest(server)
      .post("/product")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", imageBuffer, "teste.png")
      .field("description", "Apenas descrição");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Validation error");
  });
});
