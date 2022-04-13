import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class PurchaseService {
  constructor(private apiService: ApiService) {}

  getAllPurchases(): Observable<any> {
    return this.apiService.get(`/Purchase`);
  }
  createPurchase(purchase): Observable<any> {
    return this.apiService.post(`/Purchase`, purchase);
  }
  editPurchase(purchase, id): Observable<any> {
    return this.apiService.put(`/Purchase/${id}`, purchase);
  }
  getPurchaseById(id: number): Observable<any> {
    return this.apiService.get(`/Purchase/${id}`);
  }
  deletePurchaseById(id: number): Observable<any> {
    return this.apiService.delete(`/Purchase/${id}`);
  }
  DeleteMultiplePurchase(ids:string[]): Observable<any> {
    return this.apiService.post(`/Purchase/DeleteMultiplePurchase`,ids);
  }
  getPurchaseByWarehouseId(id): Observable<any> {
    return this.apiService.get(`/Purchase/WareHouse/${id}`);
  }
}
