import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // prepend the base URL to the request
  const cloned = req.clone({
    url: `http://localhost:3000/api/v1/${ req.url.startsWith('/') ? req.url.slice(1) : req.url }`
  });

  return next(cloned);
};
