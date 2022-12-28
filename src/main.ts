import { Logger, LoggerService, LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

import envConfig from '~src/config/env.config';
import { AppModule } from '~src/app.module';
import { appConstants as c } from '~src/shared/constants';

// this helper config must be here, before be used in NestFactory.create
export const loggerConfig: false | LoggerService | LogLevel[] = (envConfig().app.logger.split(',') as false | LoggerService | LogLevel[]);
// this helper function must be here, before be used in NestFactory.create, else we get undefined or other strange behaviors
const getHttpsOptions = () => {
  let httpsOptions = undefined;
  const httpsEnabled = envConfig().server.httpsEnabled;
  const httpsKeyFile = envConfig().server.httpsKeyFile;
  const httpsCertFile = envConfig().server.httpsCertFile;
  if (httpsEnabled) {
    if (!fs.existsSync(httpsKeyFile) || !fs.existsSync(httpsCertFile)) {
      throw new Error(`certificate files not found ${httpsKeyFile} or ${httpsCertFile}`);
    }
    // override default
    httpsOptions = { key: fs.readFileSync(httpsKeyFile), cert: fs.readFileSync(httpsCertFile) }
  }
  return httpsOptions;
};

const context = 'NestApplication';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: getHttpsOptions(),
    logger: loggerConfig,
  });
  // get configService instance 
  const configService = app.get(ConfigService);
  // get config variables
  const corsOriginEnabled = configService.get('server.corsOriginEnabled');
  const corsOriginFqnd = configService.get('server.corsOriginFqnd');
  const httpsEnabled = configService.get('server.httpsEnabled');
  const httpPort = configService.get('server.httpPort');
  const httpsPort = configService.get('server.httpsPort');
  const httpsKeyFile = configService.get('server.httpsKeyFile');
  const httpsCertFile = configService.get('server.httpsCertFile');

  // global prefix  
  app.setGlobalPrefix('v1');

  // rest server cors, before any middleware
  let corsOptions: { origin?: string[] | boolean, credentials: boolean } = { credentials: true, origin: true };
  let corsMessage = 'disabled';
  // inject origin if corsOriginEnabled
  if (corsOriginEnabled) {
    corsOptions = { ...corsOptions, origin: corsOriginFqnd };
    corsMessage = `authorized domains: [${corsOriginFqnd.join(', ')}]`;
  };
  app.enableCors(corsOptions);
  // pipes middleware
  // whitelist: any properties not declared in their DTO classes will be removed returned object
  // transform: automatically transform payloads to be objects typed according to their DTO classes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // TODO:
  // global-scoped filter
  // app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  // swagger
  const options = new DocumentBuilder()
    .setTitle('NestJS Realworld Example App')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  // start server
  const serverPort = httpsEnabled ? httpsPort : httpPort;
  const serverProto = httpsEnabled ? 'https' : 'http';
  await app.listen(serverPort).then(() => {
    Logger.log(`  ${c.packageName} v${c.packageVersion} server started`, context);
    Logger.log(`  server api: '${serverProto}://${c.localDomain}:${serverPort}/v1'`, context);
    Logger.log(`  server docs: '${serverProto}://${c.localDomain}:${serverPort}/docs'`, context);
    if (httpsEnabled) {
      Logger.log(`  server certificates: '${httpsKeyFile}, ${httpsCertFile}'`, context);
    }
    if (corsOriginEnabled) {
      Logger.log(`  server corsOrigin '${corsMessage}'`, context);
    }
  });
}

bootstrap()
  .catch((err) => {
    console.log(err);
  });
