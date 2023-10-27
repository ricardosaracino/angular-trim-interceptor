
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

if (request.body && !(request.body instanceof FormData)) {
      
      const isString = (value: any): boolean => typeof value === 'string' || value instanceof String;

      const trimObject = (reqBody: any): any => {

        if (isString(reqBody)) {

          return reqBody.trim();

        } else if (reqBody instanceof Array) {

          const body = [];

          reqBody.forEach(d =>body.push(trimObject(d)));

          return body;

        } else if (reqBody instanceof Object) {
          
          const  body = {};

          Object.keys(reqBody).forEach(key => {
            body[key] = trimObject(reqBody[key]);
          });

          return body
        }

        return reqBody;
      };

      const body = trimObject(request.body);

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
