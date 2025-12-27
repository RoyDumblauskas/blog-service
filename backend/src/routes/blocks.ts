import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { articles } from '../db/schema.ts';
import express, { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);
export const blocksRouter = express.Router();

// TODO: implement
