import { afterAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import { OrderType } from "@prisma/client";
import supertest from "supertest";
import { server } from "../../server.ts";

describe("POST/product/add", () => {
  afterAll(async () => {
    await prismaClient.item.deleteMany();
    await prismaClient.order.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.category.deleteMany();
    await prismaClient.$disconnect();
  });

  async function createScenario(isDraft: boolean = true) {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    const category = await prismaClient.category.create({
      data: { name: "Pizza" },
    });
    const product = await prismaClient.product.create({
      data: {
        name: "Pizza Calabresa",
        price: "50.00",
        description: "Grande",
        banner: "img",
        categoryId: category.id,
      },
    });

    const order = await prismaClient.order.create({
      data: {
        table: 1,
        name: "Mesa 1",
        userId: user.id,
        status: "PENDING",
        type: OrderType.DINE_IN,
        draft: isDraft,
      },
    });

    return { token, user, order, product };
  }

  it("should add an item to a draft order using PRODUCT PRICE", async () => {
    const { token, order, product } = await createScenario(true);

    const response = await supertest(server)
      .post("/product/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderId: order.id,
        productId: product.id,
        amount: 2,
        unitPrice: product.price,
      });

    expect(response.status).toBe(201);
    expect(response.body.item).toHaveProperty("id");
    expect(response.body.item.unitPrice).toBe("50.00");
    expect(response.body.item.amount).toBe(2);
  });

  it("should NOT add item to an order belonging to another user", async () => {
    const scenario1 = await createScenario(true);

    const attacker = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .post("/product/add")
      .set("Authorization", `Bearer ${attacker.token}`)
      .send({
        orderId: scenario1.order.id,
        productId: scenario1.product.id,
        amount: 1,
        unitPrice: scenario1.product.price,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/permission/i);
  });

  it("should NOT add item if order is not a DRAFT (Already sent)", async () => {
    const { token, order, product } = await createScenario(false);

    const response = await supertest(server)
      .post("/product/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderId: order.id,
        productId: product.id,
        amount: 1,
        unitPrice: product.price,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain(
      "Cannot add items to an order that is already processed"
    );
  });

  it("should return 400 if validation fails (missing fields)", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .post("/product/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        // Faltam orderId, productId, amount
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
  });
});
