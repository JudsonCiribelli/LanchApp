import type { Request, Response } from "express";
import { UpdateProfileService } from "../../services/user/updateProfileService.ts";

class UpdateProfileController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const { newName, newEmail, newPhone } = req.body;

    try {
      const updateProfileService = new UpdateProfileService();

      const updatedUser = await updateProfileService.execute({
        userId,
        newName,
        newEmail,
        newPhone,
      });

      return res.status(202).send(updatedUser);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export { UpdateProfileController };
