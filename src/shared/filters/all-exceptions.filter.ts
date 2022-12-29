import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, InternalServerErrorException, Logger } from '@nestjs/common';
import { CustomHttpException } from '../exceptions';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    // don't enable this else welcome to Converting circular structure to JSON word, use only when debug and wiselly
    // (node:92046) UnhandledPromiseRejectionWarning: TypeError: Converting circular structure to JSON
    // Logger.error(`Error: ${JSON.stringify(exception)}`, AllExceptionsFilter.name);
    if (exception.message) {
      Logger.error(`Error: ${exception.message}`, AllExceptionsFilter.name);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Custom exception (refer to: src/common/exceptions/custom-http.exception.ts)
    if (exception instanceof CustomHttpException) {
      const exceptionResponse = exception.getResponse();
      const status = exception.getStatus();
      if (typeof exceptionResponse === 'string') {
        return response.status(status).json({
          statusCode: status,
          path: request.url,
          errorMessage: exceptionResponse,
        });
      }
      return response.status(status).json({
        statusCode: status,
        path: request.url,
        ...exceptionResponse,
      });
    }

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseMessage = (type: string, message: string, data?: any) => {
      response.status(status).json({
        statusCode: status,
        path: request.url,
        errorType: type,
        errorMessage: message,
        errorData: data,
      });
    };

    try {
      let exceptionObj: any = exception.getResponse();
      if (exception.message || !exceptionObj || !exceptionObj.message) {
        exceptionObj = exception;
      }
      // Throw an exceptions for either
      // ValidationError, TypeError, CastError and Error
      if (exceptionObj && !exceptionObj.message) {
        // use exception.message.message to get jwt expired
        const errorMessage = exceptionObj.stack;
        // Logger.error(errorMessage, AllExceptionsFilter.name);
        responseMessage(exceptionObj.name ? exceptionObj.name : 'Error', errorMessage, (exceptionObj as any).errorData ? (exceptionObj as any).errorData : undefined);
      } else {
        // this prevents omitting errorMessage like the problem that we have in omitted
        const errorMessage = exceptionObj.message;
        // Logger.error(errorMessage, AllExceptionsFilter.name);
        responseMessage(exceptionObj.name ? exceptionObj.name : 'Error', errorMessage, (exceptionObj as any).errorData ? (exceptionObj as any).errorData : undefined);
      }
    } catch (err) {
      responseMessage('Error', (exception as any).errorData || exception.message, undefined);
    }
  }
}
