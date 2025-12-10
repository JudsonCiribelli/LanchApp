import { afterAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import { OrderType } from "@prisma/client";
import supertest from "supertest";
import { server } from "../../server.ts";

describe("GET/orders/status", () => {
  afterAll(async () => {
    await prismaClient.order.deleteMany();
    await prismaClient.address.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return ONLY orders with status 'PENDING'", async () => {
    const { token, user } = await makeAuthenticatedUser("ADMIN");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pendingOrder1 = await prismaClient.order.create({
      data: {
        table: 2,
        name: "Pedido Pendente 1",
        userId: user.id,
        type: OrderType.DINE_IN,
        status: "PENDING",
      },
    });

    await prismaClient.order.create({
      data: {
        table: 3,
        name: "Pedido Finalizado",
        userId: user.id,
        type: OrderType.DINE_IN,
        status: "FINISHED",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pendingOrder2 = await prismaClient.order.create({
      data: {
        table: 4,
        name: "Pedido Pendente 2",
        userId: user.id,
        type: OrderType.DINE_IN,
        status: "PENDING",
      },
    });

    const response = await supertest(server)
      .get("/orders/status")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    const list = response.body.result as Array<{ name: string }>;

    expect(list).toHaveLength(2);

    const names = list.map((o: { name: string }) => o.name);
    expect(names).toContain("Pedido Pendente 1");
    expect(names).toContain("Pedido Pendente 2");
    expect(names).not.toContain("Pedido Rascunho");
  });

  it("should return all orders", async () => {
    const { token, user } = await makeAuthenticatedUser("ADMIN");

    await prismaClient.order.create({
      data: {
        name: "Judson",
        table: 10,
        userId: user.id,
        type: OrderType.DINE_IN,
        addressId: null,
      },
    });

    const response = await supertest(server)
      .get("/orders/status")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should return empty list if there are no PENDING orders", async () => {
    await prismaClient.order.deleteMany();

    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .get("/orders/status")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.result).toEqual([]);
  });

  it("should return 401 if not authenticated", async () => {
    const response = await supertest(server).get("/orders/status");

    expect(response.status).toBe(401);
  });
});
