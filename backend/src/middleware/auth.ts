import { Request, Response, NextFunction } from "express";
import { users } from "../db/schema.ts";

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Either get the user profile of the logged in user, 
  // or default to anonymous permissions 

  const token = req.header("Authentication");

  if (!token) {
    return res.status(401).json({
      error: "Missing Token",
    });
  };

  next();
};
