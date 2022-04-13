import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class AdjustmentService {
  constructor(private apiService: ApiService) {}

  getAllAdjustments(pagination=null): Observable<any> {
    return this.apiService.get(`/Adjustment`, pagination);
  }
  createAdjustment(adjustment): Observable<any> {
    return this.apiService.post(`/Adjustment`, adjustment);
  }
  deleteAdjustmentById(id): Observable<any> {
    return this.apiService.delete(`/Adjustment/${id}`);
  }
  DeleteMultipleAdjustments(ids:string[]): Observable<any> {
    return this.apiService.post(`/Adjustment/DeleteMultipleAdjustments`,ids);
  }
  editAdjustmentById(adjustment, id): Observable<any> {
    return this.apiService.put(`/Adjustment/${id}`, adjustment);
  }
  getAdjustmentById(id): Observable<any> {
    return this.apiService.get(`/Adjustment/${id}`);
  }
}
