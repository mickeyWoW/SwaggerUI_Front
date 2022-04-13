import { Pipe, PipeTransform } from "@angular/core";
import { map } from "rxjs/operators";
import { BrandService } from "src/app/core/services/brand.service";
import { CategoryService } from "src/app/core/services/category.service";

@Pipe({
  name: "Brand",
})
export class BrandPipe implements PipeTransform {
  constructor(private brandService: BrandService) {}
  transform(id: number) {
    if (id === null || id === undefined) {
      return id;
    }

    return this.brandService.getBrandById(id).pipe(
      map((response) => {
        if(response)
          return response.ShortName;
      }),
    );
  }
}
