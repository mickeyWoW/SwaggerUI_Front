import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class RolesService {
  constructor(private apiService: ApiService) {}

  getAllRoles(): Observable<any> {
    return this.apiService.get(`/Role`);
  }
  createRole(role): Observable<any> {
    return this.apiService.post(`/Role`, role);
  }
  deleteRoleById(id): Observable<any> {
    return this.apiService.delete(`/Role/${id}`);
  }
}
