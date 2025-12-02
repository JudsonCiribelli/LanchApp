import prismaClient from "../../lib/client.ts";

interface GetUserProps {
  userId: string;
}

class GetUserService {
  async execute({ userId }: GetUserProps) {
    if (!userId) {
      throw new Error("User id is required!");
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
export { GetUserService };
