import { Request, Response, NextFunction } from "express";
import JsonWebToken, { defaultJWT } from '../types/JsonWebToken.ts';
import { verifySignature, decodeJWT } from '../helpers/jwt.ts';

export function loadJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");

  // If there is no jwt, proceed to request with default permissions
  if (!authHeader) {
    req.jwt = defaultJWT();
  } else {
    // otherwise decode the jwt
    const [scheme, token] = authHeader.split(" ");

    if (scheme.toLowerCase() != "bearer") {
      return res.status(401).json({
        error: "Invalid JWT"
      });
    };

    if (token.split(".").length !== 3) {
      return res.status(401).json({
        error: "Invalid JWT"
      });
    }

    const [header, payload, signature] = token.split(".");
    const validJWT: boolean = verifySignature(header, payload, signature);
    let decodedToken: JsonWebToken;

    try {
      decodedToken = decodeJWT(token);
    } catch {
      return res.status(401).json({
        error: "Invalid JWT"
      });
    }

    const validClaims: boolean =
      decodedToken.payload.exp >= Math.floor(Date.now() / 1000) &&
      decodedToken.header.alg === "HS256" &&
      decodedToken.header.typ === "JWT";

    if (validJWT && validClaims) {
      req.jwt = decodedToken;
    } else {
      // maybe attempt token refresh here
      return res.status(401).json({
        error: "Invalid JWT"
      });
    }
  }

  next();
};

