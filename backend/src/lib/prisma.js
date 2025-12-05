import { PrismaClient } from "@prisma/client";
import { createPostgresAdapter } from "@prisma/adapter-postgresql";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = createPostgresAdapter({ pool });

export const prisma = new PrismaClient({
    adapter,
});