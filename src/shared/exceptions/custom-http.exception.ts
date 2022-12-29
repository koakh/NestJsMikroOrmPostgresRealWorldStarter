import { HttpException, HttpStatus } from '@nestjs/common';

interface CustomHttpExceptionPayloadBasis {
  errorType?: string,
  errorData?: any;
}

interface CustomHttpExceptionPayloadBasisWithMessage extends CustomHttpExceptionPayloadBasis {
  errorMessage: string;
}
interface CustomHttpExceptionPayloadBasisWithKey extends CustomHttpExceptionPayloadBasis {
  errorKey: string;
}

export type CustomHttpExceptionPayload = CustomHttpExceptionPayloadBasisWithMessage | CustomHttpExceptionPayloadBasisWithKey;

export class CustomHttpException extends HttpException {
  constructor(statusCode: HttpStatus, payload: CustomHttpExceptionPayload) {
    super(payload, statusCode);
  }
}