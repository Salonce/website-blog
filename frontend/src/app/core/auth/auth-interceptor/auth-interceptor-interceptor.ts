import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const clonedReq = req.clone({
    withCredentials: true
  });
  
  return next(clonedReq).pipe(
    catchError(err => {

      if (req.url.endsWith('/auth') || req.url.endsWith('/logout')) {
        return of(new HttpResponse({ body: null }));
      }

      if (err.status === 401) {
        window.location.href = '/oauth2/authorization/google';
      }
      return throwError(() => err);
    })
  );
};