import { z } from "zod";

/**
 * Server-side environment variables.
 * These are validated at runtime startup.
 */
const serverEnvSchema = z.object({
   MONGODB_URI: z.url().min(1),
  MONGODB_DB_NAME: z.string().min(1),

  // Better Auth (always required once auth exists)
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.url("BETTER_AUTH_URL must be a valid URL"),

  // OAuth providers (optional at startup)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
});


//  * Parse and validate process.env
//  * Fail fast if invalid.

const parsedEnv = serverEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
 
  const structuredErrors = z.treeifyError(parsedEnv.error);
  
  console.error("Invalid environment variables:", structuredErrors);
  
  throw new Error("Invalid environment configuration");
}


//  * Export validated, typed env values.
//  * These are safe to consume in server-only code.

export const env = parsedEnv.data;
