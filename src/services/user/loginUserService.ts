import { compare } from "bcryptjs";
import prismaClient from "../../lib/client.ts";
import jwt from "jsonwebtoken";

interface LoginUserProps {
  email: string;
  password: string;
}

class LoginUserService {
  async execute({ email, password }: LoginUserProps) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("user can be defined!");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("password does't match!");
    }

    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      {
        subject: user.id,
        expiresIn: "30d",
      }
    );

    return { token: token };
  }
}

export { LoginUserService };
