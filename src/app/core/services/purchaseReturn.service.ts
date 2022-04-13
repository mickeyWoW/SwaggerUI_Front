import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class PurchaseReturnService {
  constructor(private apiService: ApiService) {}

  createPurchaseReturn(purchaseReturn): Observable<any> {
    return this.apiService.post("/PurchaseReturn", purchaseReturn);
  }
  editPurchaseReturn(purchaseReturn, id): Observable<any> {
    return this.apiService.put("/PurchaseReturn", purchaseReturn);
  }
  getPurchaseReturnById(id): Observable<any> {
    return this.apiService.get(`/PurchaseReturn/${id}`);
  }
  deletePurchaseById(id): Observable<any> {
    return this.apiService.delete(`/PurchaseReturn/${id}`);
  }
  DeleteMultiplePurchaseReturn(ids:string[]): Observable<any> {
    return this.apiService.post(`/PurchaseReturn/DeleteMultiplePurchaseReturn`,ids);
  }
  getAllPurchaseReturns(): Observable<any> {
    return this.apiService.get("/PurchaseReturn");
  }
  getPurchaseReturnByWarehouseId(id): Observable<any> {
    return this.apiService.get(`/PurchaseReturn/WareHouse/${id}`);
  }
}
