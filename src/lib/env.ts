/**
 * Environment configuration with validation
 */

const requiredEnvVars = ['NEXT_PUBLIC_API_URL'] as const;

type EnvConfig = {
  apiUrl: string;
  appName: string;
  nodeEnv: 'development' | 'production' | 'test';
};

function validateEnv(): EnvConfig {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL!,
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Servy',
    nodeEnv: (process.env.NODE_ENV as EnvConfig['nodeEnv']) || 'development',
  };
}

export const env = validateEnv();
