
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.body && !(request.body instanceof FormData)) {

      const body: { [key: string]: any } = {};

      const isString = (value: any): boolean => typeof value === 'string' || value instanceof String;

      const trimObject = (reqBody: any, _body: any): void => Object.keys(reqBody).forEach(key => {

        if (isString(reqBody[key])) {
          _body[key] = reqBody[key].trim();
        } else if (reqBody[key] instanceof Array) {
          _body[key] = [];
          trimObject(reqBody[key], _body[key]);
        } else if (reqBody[key] instanceof Object) {
          _body[key] = {};
          trimObject(reqBody[key], _body[key]);
        } else {
          _body[key] = reqBody[key];
        }
      });

      trimObject(request.body, body);

      request = request.clone({ body });
    }

    return next.handle(request).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError(response => {
        return throwError(response);
      }),
    );
  }
}
