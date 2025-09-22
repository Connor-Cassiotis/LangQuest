/**
 * Database Connection Configuration
 * 
 * This module sets up the Drizzle ORM connection to a Neon PostgreSQL database.
 * It configures the database client with the schema definitions for type safety.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Create Neon database connection using environment variable
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle ORM with Neon connection and schema
const db = drizzle(sql, { schema });

export default db;