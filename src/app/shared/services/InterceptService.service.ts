import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { TokenService } from "../../core/services/authToken.service";
@Injectable()
export class InterceptService implements HttpInterceptor {
    constructor(
        private _tokenService: TokenService,
        private _route: Router) {

    }
    // intercept request and add token
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var token = localStorage.getItem('callACabJwtToken');
        if (token) {
            // modify request
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        // console.log("----request----");

        // console.log(request);

        // console.log("--- end of request---");


        return next.handle(request)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {

                        // console.log(" all looks good");
                        // // http response status code
                        // console.log(event.status);
                    }
                }, error => {
                    // http response status code
                    // console.log("----response----");
                    // console.error("status code:");
                    // console.error(error.status);
                    // console.error(error.message);
                    // console.log("--- end of response---");
                    if (error.status == 401) {
                        //this._spinner.hide();
                        this._tokenService.destroyToken();
                        this._route.navigateByUrl("/sessions/signin");
                    }

                })
            )

    };

}