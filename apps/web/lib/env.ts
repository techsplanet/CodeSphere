import { z } from "zod";

/**
 * Server-side environment variables.
 * These are validated at runtime startup.
 */
const serverEnvSchema = z.object({
  MONGODB_URI: z
    .url("MONGODB_URI must be a valid URL")
    .min(1, "MONGODB_URI is required"),

  MONGODB_DB_NAME: z
    .string()
    .min(1, "MONGODB_DB_NAME is required"),
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
