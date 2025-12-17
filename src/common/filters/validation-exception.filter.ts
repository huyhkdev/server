import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorMessage } from '../constants/errorMessage.constant';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const isValidationError =
      typeof exceptionResponse === 'object' &&
      exceptionResponse.hasOwnProperty('message') &&
      Array.isArray((exceptionResponse as any).message);

    if (isValidationError) {
      response.status(status).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ErrorMessage.INVALID_BODY,
      });
    } else {
      response.status(status).json(exceptionResponse);
    }
  }
}
