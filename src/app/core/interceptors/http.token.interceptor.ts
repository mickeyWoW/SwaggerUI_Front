// import { Injectable, Injector } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class HttpTokenInterceptor implements HttpInterceptor {
//   constructor(private jwtService: JwtService) { }

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//     if (this.isValidRequestForInterceptor(req.url)) {
//       const headersConfig = {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       };

//       const token = this.jwtService.getToken();

//       if (token) {
//         headersConfig['Authorization'] = `Token ${token}`;
//       }

//       const request = req.clone({ setHeaders: headersConfig });
//       return next.handle(request);

//     }
//     return next.handle(req);
//   }

//   // for Instagram
//   private isValidRequestForInterceptor(requestUrl: string): boolean {
//     // return !(requestUrl.includes('https') || requestUrl.includes('http'));
//     return !(requestUrl.includes('https'));

//   }
// }
