export interface EnvironmentVariables {
  // app
  logger: string;
  // server
  httpsEnabled: boolean;
  httpPort: number;
  httpsPort: number;
  httpsKeyFile: string;
  httpsCertFile: string;
  corsOriginEnabled: boolean;
  corsOrigin: string[];
  // datalayer
  postgresHost: string;
  postgresPort: string;
  postgresDb: string;
  postgresUser: string;
  postgresPassword: string;
  shouldDebugSql: boolean;
  // authentication
  jwtSecret: string;
  jwtExpirationDays: number;
}