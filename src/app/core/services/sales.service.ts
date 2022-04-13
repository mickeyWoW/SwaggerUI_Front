import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class SalesService {
  constructor(private apiService: ApiService) {}

  createSale(sale): Observable<any> {
    return this.apiService.post(`/Sale`, sale);
  }
  editSales(sale, id): Observable<any> {
    return this.apiService.put(`/Sale/${id}`, sale);
  }
  getSaleById(id): Observable<any> {
    return this.apiService.get(`/Sale/${id}`);
  }
  getAllSales(): Observable<any> {
    return this.apiService.get(`/Sale`);
  }
  getSalesByWarehouseId(id): Observable<any> {
    return this.apiService.get(`/Sale/WareHouse/${id}`);
  }
  deleteSalesById(id): Observable<any> {
    return this.apiService.delete(`/Sale/${id}`);
  }
  DeleteMultipleSale(ids:string[]): Observable<any> {
    return this.apiService.post(`/Sale/DeleteMultipleSale`,ids);
  }
  getAnnualSales(): Observable<any> {
    return this.apiService.get(`/Sale/saleOfYear`);
  }
}
