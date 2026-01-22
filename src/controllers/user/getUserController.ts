import type { Request, Response } from "express";
import { GetUserService } from "../../services/user/getUserService.ts";

class GetUserController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    try {
      const getUserService = new GetUserService();

      const user = await getUserService.execute({ userId });

      return res.status(200).send(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export { GetUserController };
