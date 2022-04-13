import { Pipe, PipeTransform } from "@angular/core";
import { map } from "rxjs/operators";
import { ExpenseCategoriesService } from "src/app/core/services/expense-categories.service";

@Pipe({
  name: "ExpenseCategory",
})
export class ExpenseCategoryPipe implements PipeTransform {
  constructor(private expenseCategoriesService: ExpenseCategoriesService) {}
  transform(id: number) {
    if (id === null || id === undefined) {
      return;
    }

    return this.expenseCategoriesService.getExpenseCategoryById(id).pipe(
      map((response) => {
        console.log(response);
        return response.name;
      }),
    );
  }
}
