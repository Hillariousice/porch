import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

function statusMessage(statusCode: number) {
  switch (statusCode) {
    case 400:
      return 'Bad Request';

    case 401:
      return 'Unauthorized';

    case 402:
      return 'Payment Required';

    case 403:
      return 'Forbidden';

    case 404:
      return 'Not Found';

    case 405:
      return 'Method Not Allowed';

    case 406:
      return 'Not Acceptable';

    case 408:
      return 'Request Timeout';

    case 409:
      return 'Conflict';

    default:
      return 'Internal Server Error';
  }
}

@Catch()
export class GenericExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    let status;

    if (
      isNaN(exception?.status) ||
      !Number.isInteger(exception?.status) ||
      exception?.status < 100 ||
      exception?.status > 599
    ) {
      status = 500;
    } else {
      status = exception?.status;
    }

    response.status(status).json({
      status: false,
      statusCode: status,
      message:
        exception?.response?.message ||
        exception?.message ||
        'Internal Server Error',
      error: exception?.response?.error || statusMessage(exception?.status),
    });

    return null;
  }
}
