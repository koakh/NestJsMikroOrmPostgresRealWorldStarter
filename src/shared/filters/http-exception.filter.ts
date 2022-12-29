import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    Logger.error(`Error: ${JSON.stringify(exception)}`, HttpExceptionFilter.name);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();
    const { stack, message } = exception;

    response.status(statusCode).json({
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
      error: message ? message : stack,
    });
  }
}
