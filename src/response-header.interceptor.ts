import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Response as ExpressResponse } from 'express';

@Injectable()
export class ResponseHeaderInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();

        const ResponseObj: ExpressResponse = context.switchToHttp().getResponse();
        ResponseObj.setHeader('X-Frame-Options', 'DENY');
        ResponseObj.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();
                const delay = Date.now() - now;
                console.log(`${response.statusCode} | [${request.method}] ${request.originalUrl} - ${delay}ms`);
            }),
        );
    }
}