import { config } from 'dotenv';
import { z } from 'zod';

// 处理命令行参数，设置环境变量
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  // 支持 -e KEY=VALUE 格式设置任意环境变量
  if (args[i] === "-e" || args[i] === "--env") {
    if (i + 1 < args.length) {
      const envPair = args[i + 1];
      const equalSignIndex = envPair.indexOf('=');
      if (equalSignIndex > 0) {
        const key = envPair.substring(0, equalSignIndex);
        const value = envPair.substring(equalSignIndex + 1);
        process.env[key] = value;
      }
      i++; // 跳过下一个参数，因为它是值
    }
  } 
  // 支持 --token 和 -t 参数作为特殊情况
  else if (args[i] === "--token" || args[i] === "-t") {
    if (i + 1 < args.length) {
      process.env.FIGMA_PERSONAL_ACCESS_TOKEN = args[i + 1];
      i++; // 跳过下一个参数，因为它是值
    }
  } else if (args[i].startsWith("--token=")) {
    process.env.FIGMA_PERSONAL_ACCESS_TOKEN = args[i].substring(8);
  } else if (args[i].startsWith("-t=")) {
    process.env.FIGMA_PERSONAL_ACCESS_TOKEN = args[i].substring(3);
  }
}

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
