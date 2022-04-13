import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";

@Injectable()
export class ExpenseCategoriesService {
  constructor(private apiService: ApiService) {}

  createExpenseCategory(expenseCategory): Observable<any> {
    return this.apiService.post(`/ExpenseCategorie`, expenseCategory);
  }
  getAllExpenseCategories(): Observable<any> {
    return this.apiService.get(`/ExpenseCategorie`);
  }

  deleteExpenseCategoryById(id): Observable<any> {
    return this.apiService.delete(`/ExpenseCategorie/${id}`);
  }

  DeleteMultipleExpenseCategory(ids:string[]): Observable<any> {
    return this.apiService.post(`/ExpenseCategorie/DeleteMultipleExpenseCategory`,ids);
  }
  getExpenseCategoryById(id): Observable<any> {
    return this.apiService.get(`/ExpenseCategorie/${id}`);
  }
}
