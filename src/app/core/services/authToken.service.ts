import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class TokenService {
  constructor(private apiService: ApiService) {}

  getToken(): String {
    return window.localStorage["callACabJwtToken"];
  }

  saveToken(token: String) {
    window.localStorage["callACabJwtToken"] = token;
  }

  destroyToken() {
    window.localStorage.removeItem("callACabJwtToken");
  }
}
