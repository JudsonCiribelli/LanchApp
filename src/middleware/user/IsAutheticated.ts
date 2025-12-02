import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface IsAuthenticatedProps {
  sub: string;
}

export function IsAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).send({ message: "Auth token is required" }).end();
  }

  const [, token] = authToken!.split(" ");

  try {
    const { sub } = jwt.verify(
      token as string,
      process.env.JWT_SECRET!
    ) as IsAuthenticatedProps;

    req.userId = sub;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Authorization error!" }).end();
  }
}
