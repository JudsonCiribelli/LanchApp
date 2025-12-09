import { afterAll, describe, expect, it } from "vitest";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import prismaClient from "../../lib/client.ts";
import { OrderType } from "@prisma/client";

describe("POST/ORDER", () => {
  afterAll(async () => {
    await prismaClient.order.deleteMany();
    await prismaClient.address.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should create a DINE_IN order successfully", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .post("/order")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Judson",
        table: 10,
        type: OrderType.DINE_IN,
        addressId: undefined,
      });

    expect(response.status).toBe(201);
    expect(response.body.order).toHaveProperty("id");
    expect(response.body.order.type).toBe("DINE_IN");
    expect(response.body.order.table).toBe(10);
    expect(response.body).toEqual({
      order: {
        id: expect.any(String),
        table: expect.any(Number),
        draft: expect.any(Boolean),
        name: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        status: expect.any(String),
        type: expect.any(String),
        addressId: null,
        userId: expect.any(String),
      },
    });
  });

  it("should NOT create DINE_IN order without table number", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .post("/order")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Cliente Sem Mesa",
        type: OrderType.DINE_IN,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "To dine in, a table number is required.",
    });
  });

  it("should create a DELIVERY order with explicit addressId", async () => {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    const address = await prismaClient.address.create({
      data: {
        userId: user.id,
        street: "Rua Teste",
        number: "123",
        neighborhood: "Centro",
        city: "Cidade",
        state: "SP",
        zipCode: "12345678",
      },
    });

    const response = await supertest(server)
      .post("/order")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Entrega em Casa",
        type: OrderType.DELIVERY,
        addressId: address.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.order.type).toBe("DELIVERY");
    expect(response.body.order.addressId).toBe(address.id);
  });

  it("should create DELIVERY order auto-selecting address (User has only 1)", async () => {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    const address = await prismaClient.address.create({
      data: {
        userId: user.id,
        street: "Rua Unica",
        number: "10",
        neighborhood: "Bairro",
        city: "Cidade",
        state: "SP",
        zipCode: "88888888",
      },
    });

    const response = await supertest(server)
      .post("/order")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Auto Select",
        type: OrderType.DELIVERY,
      });

    expect(response.status).toBe(201);
    expect(response.body.order.addressId).toBe(address.id);
  });

  it("should FAIL to create DELIVERY order if user has multiple addresses and none selected", async () => {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    await prismaClient.address.createMany({
      data: [
        {
          userId: user.id,
          street: "Rua 1",
          number: "1",
          neighborhood: "B",
          city: "C",
          state: "S",
          zipCode: "11111111",
        },
        {
          userId: user.id,
          street: "Rua 2",
          number: "2",
          neighborhood: "B",
          city: "C",
          state: "S",
          zipCode: "22222222",
        },
      ],
    });

    const response = await supertest(server)
      .post("/order")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Confuso",
        type: OrderType.DELIVERY,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Choose a delivery address." });
  });

  it("should FAIL to create DELIVERY order if user has NO address", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .post("/order")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sem Casa",
        type: OrderType.DELIVERY,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Delivery is not possible without a registered address",
    });
  });

  it("should create a PICKUP order successfully", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .post("/order")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Vou buscar",
        type: OrderType.PICKUP,
      });

    expect(response.status).toBe(201);
    expect(response.body.order.type).toBe("PICKUP");
    expect(response.body.order.table).toBe(0);
    expect(response.body.order.addressId).toBeNull();
  });
});
