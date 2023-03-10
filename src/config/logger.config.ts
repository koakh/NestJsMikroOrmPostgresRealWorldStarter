import { LoggerService, LogLevel } from '@nestjs/common';
import envConfig from '../config/env.config';

export const loggerConfig: false | LoggerService | LogLevel[] = (envConfig().app.logger.split(',') as false | LoggerService | LogLevel[]);
