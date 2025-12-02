import { hash } from "bcryptjs";
import { faker } from "@faker-js/faker";
import prismaClient from "../../../lib/client.ts";

export const makeUser = async (role: "ADMIN" | "CLIENT" = "CLIENT") => {
  const plainPassword = faker.internet.password({ length: 9 });
  const passwordHash = await hash(plainPassword, 8);

  const user = await prismaClient.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      phone: faker.phone.number(),
      role: role,
    },
  });

  return { user, plainPassword };
};
