import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url("VITE_API_URL must be a valid HTTP/HTTPS URL").default("http://localhost:3000/api/v1"),
  VITE_SOCKET_URL: z.string().url("VITE_SOCKET_URL must be a valid HTTP/HTTPS URL").optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.format());
    return {
      VITE_API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
      VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
    };
  }
  return result.data;
}

export const env = validateEnv();
