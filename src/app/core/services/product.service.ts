import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

import { FilterData } from "src/app/views/product/product.service";
import { PageNation } from "src/app/shared/utils";

@Injectable()
export class ProductService {
  constructor(private apiService: ApiService) {}

  createProduct(product): Observable<any> {
    return this.apiService.post("/Product", product);
  }
  getProductById(productId): Observable<any> {
    return this.apiService.get("/Product/" + productId);
  }
  getAllProducts(pagination=null): Observable<any> {
    return this.apiService.post("/Product/GetProducts",pagination);
  }
  updateProduct(product, id): Observable<any> {
    return this.apiService.put(`/Product/${id}`, product);
  }
  deleteProductById(id: number): Observable<any> {
    return this.apiService.delete(`/Product/${id}`);
  }

  
  DeleteMultipleProducts(ids:string[]): Observable<any> {
    return this.apiService.post(`/Product/DeleteMultipleProducts`,ids);
  }

  getProductsByFilter(code): Observable<any> {
    return this.apiService.post(`/Products/Filter/?code=${code}`);
  }

  getProductsByFilters(filter: FilterData, pagination: PageNation): Observable<any> {
    return this.apiService.post(`/Products/Filter`, Object.assign(filter, { pagination: pagination }));
  }
  //warehous products

  getWarehouseProducts(): Observable<any> {
    return this.apiService.get(`/ProductWarehouse`);
  }

  UpdateImages(UpdateImages): Observable<any> {
    return this.apiService.post(`/Product/UpdateProductImages`, UpdateImages);
  }
}
