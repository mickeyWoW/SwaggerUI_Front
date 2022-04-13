import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class PaymentPurchaseReturnService {
  constructor(private apiService: ApiService) {}

  getAllPaymentPurchaseReturn(): Observable<any> {
    return this.apiService.get(`/PaymentPurchaseReturn`);
  }
}
