import { makeUser } from "./makeUser.ts";
import jwt from "jsonwebtoken";

export const makeAuthenticatedUser = async (role: "ADMIN" | "CLIENT") => {
  const { user } = await makeUser(role);

  const token = jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_SECRET!
  );
  return { user, token };
};
