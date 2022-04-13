import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class AdjustmentDetailsService {
  constructor(private apiService: ApiService) {}

  getAllAdjustmentDetails(): Observable<any> {
    return this.apiService.get(`/AdjustmentDetails`);
  }
  createAdjustmentDetails(adjustmentDetails): Observable<any> {
    return this.apiService.post(`/AdjustmentDetails`, adjustmentDetails);
  }
}
