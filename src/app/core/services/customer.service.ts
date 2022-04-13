import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class CustomerService {
  constructor(private apiService: ApiService) {}

  createCustomer(customer): Observable<any> {
    return this.apiService.post(`/Client`, customer);
  }
  updateCustomer(customer, id): Observable<any> {
    return this.apiService.put(`/Client/${id}`, customer);
  }
  getAllCustomers(): Observable<any> {
    return this.apiService.get(`/Client`);
  }
  getCustomerById(id): Observable<any> {
    return this.apiService.get(`/Client/${id}`);
  }
  deleteCustomerById(id): Observable<any> {
    return this.apiService.delete(`/Client/${id}`);
  }
  DeleteMultipleUser(ids:string[]): Observable<any> {
    return this.apiService.post(`/Client/DeleteMultipleUser`,ids);
  }
  DeleteMultipleSuplier(ids:string[]): Observable<any> {
    return this.apiService.post(`/Client/DeleteMultipleUser`,ids);
  }
}
