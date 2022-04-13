import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class PaymentSalesReturnService {
  constructor(private apiService: ApiService) {}

  getAllSalesReturnPayment(): Observable<any> {
    return this.apiService.get(`/PaymentSaleReturn`);
  }
}
