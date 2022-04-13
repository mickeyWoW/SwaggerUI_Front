import { Pipe, PipeTransform } from "@angular/core";
import { map } from "rxjs/operators";
import { BrandService } from "src/app/core/services/brand.service";
import { CategoryService } from "src/app/core/services/category.service";
import { UnitService } from "src/app/core/services/unit.service";

@Pipe({
  name: "Unit",
})
export class UnitPipe implements PipeTransform {
  constructor(
    private brandService: BrandService,
    private unitService: UnitService,
  ) {}
  transform(id: number) {
    if (id === null || id === undefined) {
      return id;
    }

    return this.unitService.getUnitById(id).pipe(
      map((response) => {
        console.log(response);
        return response.name;
      }),
    );
  }
}
