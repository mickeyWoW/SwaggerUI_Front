import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class SalesReturnService {
  constructor(private apiService: ApiService) {}

  createSalesReturn(salesReturn): Observable<any> {
    return this.apiService.post(`/SaleReturn`, salesReturn);
  }

  updateSalesReturn(salesReturn, id): Observable<any> {
    return this.apiService.put(`/SaleReturn/${id}`, salesReturn);
  }
  deleteSalesReturn(id): Observable<any> {
    return this.apiService.delete(`/SaleReturn/${id}`);
  }
  DeleteMultipleSaleReturn(ids:string[]): Observable<any> {
    return this.apiService.post(`/SaleReturn/DeleteMultipleSaleReturn`,ids);
  }
  getSalesReturnById(salesReturn): Observable<any> {
    return this.apiService.get(`/SaleReturn/${salesReturn}`);
  }
  getAllSalesReturn(): Observable<any> {
    return this.apiService.get(`/SaleReturn`);
  }
  getSalesReturnByWarehouseId(id): Observable<any> {
    return this.apiService.get(`/SaleReturn/WareHouse/${id}`);
  }
}
