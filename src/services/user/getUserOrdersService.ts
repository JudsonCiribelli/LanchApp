import prismaClient from "../../lib/client.ts";

interface GetUserOdersProps {
  userId: string;
}

class GetUserOrdersService {
  async execute({ userId }: GetUserOdersProps) {
    const userExist = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userExist) {
      throw new Error("User not found");
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        orders: true,
      },
    });

    return user?.orders;
  }
}
export { GetUserOrdersService };
