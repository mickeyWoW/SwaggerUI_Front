import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class CategoryService {
  constructor(private apiService: ApiService) {}

  createCategory(category: any): Observable<any> {
    return this.apiService.post("/Category", category);
  }
  editCategoryById(category, id): Observable<any> {
    return this.apiService.put(`/Category/${id}`, category);
  }
  deleteCategoryById(id): Observable<any> {
    return this.apiService.delete(`/Category/${id}`);
  }
  DeleteMultipleCategory(ids:string[]): Observable<any> {
    return this.apiService.post(`/Category/DeleteMultipleCategory`,ids);
  }

  getAllCategories(): Observable<any> {
    return this.apiService.get(`/Category`);
  }
  getCategoryById(id: number): Observable<any> {
    return this.apiService.get(`/Category/${id}`);
  }
}
