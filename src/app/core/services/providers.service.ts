import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class ProvidersService {
  constructor(private apiService: ApiService) {}

  createProvider(provider): Observable<any> {
    return this.apiService.post("/Provider", provider);
  }
  editProvider(provider, id): Observable<any> {
    return this.apiService.put("/Provider/" + id, provider);
  }
  getProviderById(id): Observable<any> {
    return this.apiService.get("/Provider/" + id);
  }
  getAllProviders(): Observable<any> {
    return this.apiService.get("/Provider");
  }
  deleteProvider(id): Observable<any> {
    return this.apiService.delete("/Provider/" + id);
  }
  DeleteMultipleSuplier(ids:string[]): Observable<any> {
    return this.apiService.post(`/Provider/DeleteMultipleSuplier`,ids);
  }
}
