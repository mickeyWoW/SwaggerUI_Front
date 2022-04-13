import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class TransferService {
  constructor(private apiService: ApiService) {}

  createTransfer(transfer): Observable<any> {
    return this.apiService.post(`/Transfer`, transfer);
  }
  editTransfer(transfer, id): Observable<any> {
    return this.apiService.put(`/Transfer/${id}`, transfer);
  }
  getTransferById(id): Observable<any> {
    return this.apiService.get(`/Transfer/${id}`);
  }
  getAllTransfers(): Observable<any> {
    return this.apiService.get(`/Transfer`);
  }
  getTransferByFilters(referance, fromWareHouse, toWareHouse, statut): Observable<any> {
    return this.apiService.post(`/Transfer/Filter/?referance=${referance}&fromWareHouse=${fromWareHouse}&toWareHouse=${toWareHouse}&statut=${statut}`);
  }

  deleteTransferById(id): Observable<any> {
    return this.apiService.delete(`/Transfer/${id}`);
  }
  DeleteMultipleTransfer(ids:string[]): Observable<any> {
    return this.apiService.post(`/Transfer/DeleteMultipleTransfer`,ids);
  }
}
