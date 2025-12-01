import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import prismaClient from "../../../lib/client.ts";

export const makeUser = async () => {
  const passwordHash = randomUUID().slice(0, 8);

  const user = await prismaClient.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passwordHash, 8),
      phone: faker.phone.number(),
    },
  });

  return { user, passwordHash };
};
