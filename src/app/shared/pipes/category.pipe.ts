import { Pipe, PipeTransform } from "@angular/core";
import { map } from "rxjs/operators";
import { CategoryService } from "src/app/core/services/category.service";

@Pipe({
  name: "Category",
})
export class CategoryPipe implements PipeTransform {
  constructor(private categoryService: CategoryService) {}
  transform(id: number) {
    if (id === null || id === undefined) {
      return;
    }

    return this.categoryService.getCategoryById(id).pipe(
      map((response) => {
        if(response && response.name)
          return response.name;
        return '';
      }),
    );
  }
}
