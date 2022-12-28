export interface EnvironmentVariables {
  app: {
    logger: string;
  },
  server: {
    httpPort: number;
    httpsPort: number;
    httpsEnabled: boolean;
    httpsKeyFile: string;
    httpsCertFile: string;
    corsOriginEnabled: boolean;
    corsOriginFqnd: string[];
  },
  datalayer: {
    postgresHost: string;
    postgresPort: string;
    postgresDb: string;
    postgresUser: string;
    postgresPassword: string;
    postgresShowDebugSql: boolean;
  },
  authentication: {
    jwtSecret: string;
    jwtExpirationDays: number;  
  }
}