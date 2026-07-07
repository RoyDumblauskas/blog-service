import { Request, Response, NextFunction } from "express";
import JsonWebToken from '../types/JsonWebToken.ts';

export enum Permission {
  read = 1,
  write = 2,
  delete = 4
};

export function requirePermissions(permission: number, isOwner: Boolean, requiredPermissions: number): Boolean {
  const mask = isOwner ?
    Math.floor(permission / 10) :
    permission % 10;

  return (mask & requiredPermissions) === requiredPermissions;

};
