import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { httpsOptions, loggerConfig } from './config';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { appConstants as c } from './shared/constants';

const context = 'NestApplication';
async function bootstrap() {
  const appOptions = {
    httpsOptions,
    logger: loggerConfig,
  };
  const app = await NestFactory.create(AppModule, appOptions);
  
  // get configService instance 
  const configService = app.get(ConfigService);

  // global prefix  
  app.setGlobalPrefix('v1');
  // rest server cors, before any middleware
  let corsOptions: { origin?: string[] | boolean, credentials: boolean } = { credentials: true, origin: true };
  let corsMessage = 'disabled';
  // inject origin if corsOriginEnabled
  if (configService.get('corsOriginEnabled')) {
    corsOptions = { ...corsOptions, origin: configService.get('corsOriginReactFrontend') };
    corsMessage = `authorized domains: [${configService.get('corsOriginReactFrontend').join(', ')}]`;
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
  const serverPort = configService.get('httpsEnabled') ? configService.get('httpsPort') : configService.get('httpPort');
  const serverProto = configService.get('httpsEnabled') ? 'https' : 'http';
  await app.listen(serverPort).then(() => {
    Logger.log(`  ${c.packageName} v${c.packageVersion} server started`, context);
    Logger.log(`  server api: '${serverProto}://${c.localDomain}:${serverPort}/v1'`, context);
    Logger.log(`  server docs: '${serverProto}://${c.localDomain}:${serverPort}/docs'`, context);
    if (configService.get('httpsEnabled')) {
      Logger.log(`  server certificates: '${configService.get('httpsKeyFile')}, ${configService.get('httpsCertFile')}'`, context);
    }
    if (configService.get('corsOriginEnabled')) {
      Logger.log(`  server corsOrigin '${corsMessage}'`, context);
    }
  });
}

bootstrap()
  .catch((err) => {
    console.log(err);
  });
