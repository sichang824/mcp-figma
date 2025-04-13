import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config();

// Define schema for environment variables
const envSchema = z.object({
  FIGMA_PERSONAL_ACCESS_TOKEN: z.string().min(1),
  PORT: z.string().default('3001').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate environment variables
const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('\u274c Invalid environment variables:', envVars.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = envVars.data;
