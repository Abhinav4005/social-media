console.log("🔥 prisma.config.js LOADED");
import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config()

console.log("DATABASE_URL", process.env.DATABASE_URL);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: process.env.DATABASE_URL
  }
});
