import prismaClient from "../../lib/client.ts";

interface UpdateProfileProps {
  userId: string;
  newName: string;
  newEmail: string;
  newPhone: string;
}

class UpdateProfileService {
  async execute({ userId, newName, newEmail, newPhone }: UpdateProfileProps) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: newName,
        email: newEmail,
        phone: newPhone,
      },
      // select: {
      //   name: true,
      //   email: true,
      //   phone: true,
      // },
    });

    return updatedUser;
  }
}

export { UpdateProfileService };
