import type { Response, Request } from "express";
import { GetUserOrdersService } from "../../services/user/getUserOrdersService.ts";

class GetUserOrdersController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    try {
      const getUserOdersService = new GetUserOrdersService();

      const userOrders = await getUserOdersService.execute({ userId });

      return res.status(200).send({ userOrders });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}

export { GetUserOrdersController };
