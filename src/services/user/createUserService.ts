import prismaClient from "../../lib/client.ts";

interface createUserProps {
  name: string;
  email: string;
  password: string;
  phone: string;
}

class CreateUserService {
  async execute({ name, email, password, phone }: createUserProps) {
    const userPhone = await prismaClient.user.findUnique({
      where: {
        phone: phone,
      },
    });

    const userEmail = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userEmail) {
      throw new Error("This email is already register");
    }

    if (userPhone) {
      throw new Error("This phone is already register");
    }

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        phone,
        password,
      },
    });

    return { user };
  }
}

export { CreateUserService };
