import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import express, { Request, Response } from "express";

// Create a connection to the database
const db = drizzle(process.env.DATABASE_URL!);

// Create a new express application instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
