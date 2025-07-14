import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * 响应拦截器
 * 根据ApiResponseDto中的httpStatus设置HTTP状态码
 * 业务错误返回HTTP 200，真正的HTTP错误返回对应状态码
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data: ApiResponseDto<T>) => {
        // 如果返回的是ApiResponseDto类型
        if (data && typeof data === 'object' && 'code' in data) {
          // const response = context.switchToHttp().getResponse();

          // 如果有httpStatus，设置HTTP状态码
          // if (data.httpStatus) {
          //   response.status(data.httpStatus);
          // }

          // 移除httpStatus字段，不返回给客户端

          const { ...responseData } = data;
          return responseData as ApiResponseDto<T>;
        }

        // 如果不是ApiResponseDto类型，直接返回
        return data;
      }),
    );
  }
}
