import { makeUser } from "./makeUser.ts";
import jwt from "jsonwebtoken";

export const makeAuthenticatedUser = async () => {
  const { user } = await makeUser();

  const token = jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_SECRET!
  );
  return { user, token };
};
