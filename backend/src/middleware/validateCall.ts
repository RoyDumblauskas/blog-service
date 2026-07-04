import { Request, Response, NextFunction } from "express";

export function validateCall(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
};
