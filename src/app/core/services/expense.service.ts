import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class ExpenseService {
  constructor(private apiService: ApiService) {}

  createExpense(expense): Observable<any> {
    return this.apiService.post(`/Expense`, expense);
  }
  getAllExpenses(): Observable<any> {
    return this.apiService.get(`/Expense`);
  }
  deleteExpenseById(id): Observable<any> {
    return this.apiService.delete(`/Expense/${id}`);
  }
  DeleteMultipleExpense(ids:string[]): Observable<any> {
    return this.apiService.post(`/Expense/DeleteMultipleExpense`,ids);
  }
  getExpenseByWarehouseId(id): Observable<any> {
    return this.apiService.get(`/Expense/WareHouse/${id}`);
  }
  getExpenseById(id): Observable<any> {
    return this.apiService.get(`/Expense/${id}`);
  }
  GetFilterExpense(date, reference, warehouse, expenseCetory): Observable<any> {
    return this.apiService.get(`/Expense/Filter/?date=${date}&reference=${reference}&warehouse=${warehouse}&expenseCetory=${expenseCetory}`);
  }
  updateExpense(expense, id): Observable<any> {
    return this.apiService.put(`/Expense/${id}`, expense);
  }
}
