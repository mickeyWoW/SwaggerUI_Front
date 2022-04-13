import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class SettingsService {
  constructor(private apiService: ApiService) {}

  getAllSettings(): Observable<any> {
    return this.apiService.get(`/Setting`);
  }
  getSettingsById(id): Observable<any> {
    return this.apiService.get(`/Setting/${id}`);
  }
  createSettings(setting): Observable<any> {
    return this.apiService.post(`/Setting`, setting);
  }
  deleteSettingsById(id): Observable<any> {
    return this.apiService.delete(`/Setting/${id}`);
  }
  editSettingsById(setting, id): Observable<any> {
    return this.apiService.put(`/Setting/${id}`, setting);
  }
}
