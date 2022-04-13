import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class CurrencyService {
  constructor(private apiService: ApiService) {}

  getAllCurrencies(): Observable<any> {
    return this.apiService.get(`/Currencie`);
  }
  createCurrency(currency): Observable<any> {
    return this.apiService.post(`/Currencie`, currency);
  }
  deleteCurrencyById(id): Observable<any> {
    return this.apiService.delete(`/Currencie/${id}`);
  }
 
  DeleteMultipleCurrency(ids:string[]): Observable<any> {
    return this.apiService.post(`/Currencie/DeleteMultipleCurrency`,ids);
  }
  editCurrencyById(currency, id): Observable<any> {
    return this.apiService.put(`/Currencie/${id}`, currency);
  }
}
