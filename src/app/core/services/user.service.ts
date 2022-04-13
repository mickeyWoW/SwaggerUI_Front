import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, ReplaySubject, of } from "rxjs";

import { ApiService } from "./api.service";

import { map, distinctUntilChanged, catchError } from "rxjs/operators";
import { TokenService } from "./authToken.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private http: HttpClient,
  ) {}

  signUp(user: any): Observable<any> {
    return this.apiService.post("/User/Register", user);
  }
  login(user: any): Observable<any> {
    return this.apiService.post("/User/Login", user).pipe(
      map((data) => {
        console.log(data);
        this.setAuth(data);
        return data;
      }),
    );
  }
  getAllUsers(): Observable<any> {
    return this.apiService.get("/User");
  }
  getUserById(id): Observable<any> {
    return this.apiService.get(`/User/${id}`);
  }

  login1(user: any): Observable<any> {
    return this.http
      .post(
        `https://localhost:5001/User/Login?email=${user.email}&password=${user.password}`,
        null,
      )
      .pipe(
        map(
          (data) => {
            console.log(data);
          },
          (err) => {
            console.log(err);
          },
        ),
      );
  }

  setAuth(user: any) {
    // Save JWT sent from server in localstorage
    console.log(":::User::", user);
    this.tokenService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }
}
