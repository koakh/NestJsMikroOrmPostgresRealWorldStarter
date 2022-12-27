import { EnvironmentVariables } from "../shared/interfaces";

const httpPort = parseInt(process.env.HTTP_SERVER_PORT) || 3000;
const httpsPort = parseInt(process.env.HTTPS_SERVER_PORT) || 3030;
const corsDomain = process.env.CORS_DOMAIN || 'demo.example.com';

export const configuration = (): EnvironmentVariables => ({
  // app
  logger: process.env.APP_LOGGER || 'error,warn',
  httpsEnabled: process.env.HTTPS_ENABLED === 'true' ? true : false,
  httpPort,
  httpsPort,
  httpsKeyFile: process.env.HTTPS_KEY_FILE || './config/server.key',
  httpsCertFile: process.env.HTTPS_CERT_FILE || './config/server.crt',
  // cors origin react frontend
  corsOriginEnabled: process.env.CORS_ORIGIN_ENABLED === 'true' ? true : false,
  corsOrigin: 
  process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
    `https://${corsDomain}`,
    `http://${corsDomain}`,
    `https://${corsDomain}:${httpsPort}`,
    `http://${corsDomain}:${httpsPort}`,
    `https://localhost:${httpsPort}`,
    `http://localhost:${httpsPort}`,
    `https://127.0.0.1:${httpsPort}`,
    `http://127.0.0.1:${httpsPort}`
  ],
  // dataLayer
  postgresHost: process.env.POSTGRES_HOST || 'localhost',
  postgresPort: process.env.POSTGRES_PORT || '5432',
  postgresDb: process.env.POSTGRES_DB || 'nestjsrealworld',
  postgresUser: process.env.POSTGRES_USER || 'postgres',
  postgresPassword: process.env.POSTGRES_PASSWORD || 'example',
  shouldDebugSql: process.env.POSTGRES_SHOW_DEBUG_SQL === 'true' ? true : false,
  // authentication
  jwtSecret: process.env.JWT_SECRET || 'another-super-secret-password',
  jwtExpirationDays: parseInt(process.env.JWT_EXPIRATION_DAYS) || 7,
});