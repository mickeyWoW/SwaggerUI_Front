import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class UnitService {
  constructor(private apiService: ApiService) {}

  getAllUnits(): Observable<any> {
    return this.apiService.get(`/Unit`);
  }
  createUnit(unit): Observable<any> {
    return this.apiService.post(`/Unit`, unit);
  }
  deleteUnitById(id): Observable<any> {
    return this.apiService.delete(`/Unit/${id}`);
  }
  DeleteMultipleUnit(ids:string[]): Observable<any> {
    return this.apiService.post(`/Unit/DeleteMultipleUnit`,ids);
  }
  editUnitById(unit, id): Observable<any> {
    return this.apiService.put(`/Unit/${id}`, unit);
  }
  getUnitById(id): Observable<any> {
    return this.apiService.get(`/Unit/${id}`);
  }
}
