import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class WarehouseService {
  constructor(private apiService: ApiService) {}

  getAllWarehouses(): Observable<any> {
    return this.apiService.get(`/Warehouse`);
  }
  getWarehouseById(id): Observable<any> {
    return this.apiService.get(`/Warehouse/${id}`);
  }
  getWarehouseByFilters(date, Ref, Warehouse): Observable<any> {
    debugger;
    return this.apiService.get(`/Adjustment/Filter?date=${date}&Ref=${Ref}&Warehouse=${Warehouse}`);
  }
  createWarehouse(warehouse): Observable<any> {
    return this.apiService.post(`/Warehouse`, warehouse);
  }
  editWarehouseById(warhouse, id): Observable<any> {
    return this.apiService.put(`/Warehouse/${id}`, warhouse);
  }
  deleteWarehouseById(id): Observable<any> {
    return this.apiService.delete(`/Warehouse/${id}`);
  }
  DeleteMultipleWareHouse(ids:string[]): Observable<any> {
    return this.apiService.post(`/Warehouse/DeleteMultipleWareHouse`,ids);
  }
}
