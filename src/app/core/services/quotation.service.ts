import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class QuotationService {
  constructor(private apiService: ApiService) {}

  getAllQuotations(): Observable<any> {
    return this.apiService.get(`/Quotation`);
  }
  createQuotation(quotation): Observable<any> {
    return this.apiService.post(`/Quotation`, quotation);
  }
  editQuotation(quotation, id): Observable<any> {
    return this.apiService.put(`/Quotation/${id}`, quotation);
  }
  getQuotationById(id): Observable<any> {
    return this.apiService.get(`/Quotation/${id}`);
  }
  deleteQuotationById(id): Observable<any> {
    return this.apiService.delete(`/Quotation/${id}`);
  }
  DeleteMultipleQuotation(ids:string[]): Observable<any> {
    return this.apiService.post(`/Quotation/DeleteMultipleQuotation`,ids);
  }
  
  getQuotationByWarehouseId(id): Observable<any> {
    return this.apiService.get(`/Quotation/WareHouse/${id}`);
  }
}
