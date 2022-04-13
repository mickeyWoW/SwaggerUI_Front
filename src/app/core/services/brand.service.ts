import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class BrandService {
  constructor(private apiService: ApiService) {}

  getAllBrands(): Observable<any> {
    return this.apiService.get(`/Brand`);
  }
  getBrandById(id: number): Observable<any> {
    return this.apiService.get(`/Brand/${id}`);
  }
  createBrand(brand): Observable<any> {
    return this.apiService.post(`/Brand`, brand);
  }
  editBrandById(brand, id): Observable<any> {
    return this.apiService.put(`/Brand/${id}`, brand);
  }
  deleteBrandById(id): Observable<any> {
    return this.apiService.delete(`/Brand/${id}`);
  }
  DeleteMultipleBrand(ids:string[]): Observable<any> {
    return this.apiService.post(`/Brand/DeleteMultipleBrand`,ids);
  }
}
