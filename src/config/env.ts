import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config();

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// Define schema for environment variables
const envSchema = z.object({
  // Make token optional in development mode, required in production
  FIGMA_PERSONAL_ACCESS_TOKEN: isDevelopment 
    ? z.string().default('dev_test_token')
    : z.string().min(1),
  PORT: z.string().default('3001').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate environment variables
const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('❌ Invalid environment variables:', envVars.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

// Add warning for development token
if (isDevelopment && envVars.data.FIGMA_PERSONAL_ACCESS_TOKEN === 'dev_test_token') {
  console.warn('⚠️  Using default development token. API calls to Figma will fail. Set FIGMA_PERSONAL_ACCESS_TOKEN for real API access.');
}

export const env = envVars.data;
