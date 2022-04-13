import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class PaymentSalesService {
  constructor(private apiService: ApiService) {}

  getAllSalesPayment(): Observable<any> {
    return this.apiService.get(`/PaymentSale`);
  }
}
