import { Request, Response, NextFunction } from "express";
import JsonWebToken from '../types/JsonWebToken.ts';
import { verifySignature, decodeJWT } from '../helpers/jwt.ts';
import { refreshJWT } from "./refreshJWT.ts";
import { validateCall } from "./validateCall.ts";

export function loadJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");

  // If there is no jwt, fail
  if (!authHeader) {
    return res.status(401).json({
      error: "Missing JWT"
    });
  } else {
    // otherwise decode the jwt
    const [scheme, token] = authHeader.split(" ");

    if (scheme.toLowerCase() != "bearer") {
      return res.status(401).json({
        error: "Invalid Authorization Scheme"
      });
    };

    if (token === "") {
      return res.status(401).json({
        error: "Missing JWT"
      });
    };

    if (token.split(".").length !== 3) {
      return res.status(401).json({
        error: "Malformed JWT"
      });
    }

    const [header, payload, signature] = token.split(".");
    const validJWT: boolean = verifySignature(header, payload, signature);
    let decodedToken: JsonWebToken;

    try {
      decodedToken = decodeJWT(token);
    } catch {
      return res.status(401).json({
        error: "Malformed JWT"
      });
    }

    const validClaims: boolean =
      decodedToken.header.alg === "HS256" &&
      decodedToken.header.typ === "JWT";

    const expired: boolean = decodedToken.payload.exp < Math.floor(Date.now() / 1000);

    if (validJWT && validClaims && !expired) {
      req.jwt = decodedToken;
    } else if (validJWT && validClaims && expired) {
      req.jwt = decodedToken;
      return refreshJWT(req, res, next);
    } else {
      return res.status(401).json({
        error: "Invalid JWT"
      });
    }
  }

  return validateCall(req, res, next);
};

