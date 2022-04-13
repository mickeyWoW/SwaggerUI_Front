import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class PaymentPurchaseService {
  constructor(private apiService: ApiService) {}

  getAllPaymentPurchases(): Observable<any> {
    return this.apiService.get(`/PaymentPurchase`);
  }
  createPaymentPurchase(paymentPurchase): Observable<any> {
    return this.apiService.post(`/PaymentPurchase`, paymentPurchase);
  }
  deletePaymentPurchaseById(Id): Observable<any> {
    return this.apiService.delete(`/PaymentPurchase/${Id}`);
  }
}
