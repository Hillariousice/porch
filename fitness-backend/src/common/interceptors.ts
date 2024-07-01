import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface Response<T> {
  status: boolean;
  statusCode: number;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        status:
          context.switchToHttp().getResponse().statusCode == 200 ||
          context.switchToHttp().getResponse().statusCode == 201
            ? true
            : false,
        statusCode: context.switchToHttp().getResponse().statusCode,
        data: data || null,
      })),
      catchError((err) =>
        throwError(() => {
          console.log(err);
          return new HttpException(
            {
              status: false,
              statusCode: err?.response?.statusCode || 500,
              message: err?.response?.message || 'something went wrong',
              error: err?.response?.error || 'Internal Server Error',
            },
            err?.response?.statusCode,
          );
        }).pipe(),
      ),
    );
  }
}
