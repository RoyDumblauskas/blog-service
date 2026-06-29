import JsonWebToken from '../JsonWebToken.ts';
export { }


declare module "express-serve-static-core" {
  interface Request {
    jwt: JsonWebToken;
  }
}
