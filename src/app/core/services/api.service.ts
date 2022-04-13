import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { observable, Observable, of, throwError } from "rxjs";

import { catchError } from "rxjs/operators";

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  private formatErrors(error: any) {
    if(error && error.status==401)
      return of(null);
    return throwError(error.error);
  }
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(
        `${environment.apiUrl}${path}`,
        JSON.stringify(body),
        this.httpOptions,
      )
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(
        `${environment.apiUrl}${path}`,
        JSON.stringify(body),
        this.httpOptions,
      )
      .pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http
      .delete(`${environment.apiUrl}${path}`)
      .pipe(catchError(this.formatErrors));
  }
}
