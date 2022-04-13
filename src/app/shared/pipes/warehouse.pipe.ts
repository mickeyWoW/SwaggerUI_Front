import { Pipe, PipeTransform } from "@angular/core";
import { map } from "rxjs/operators";
import { WarehouseService } from "src/app/core/services/warehouse.service";

@Pipe({
  name: "Warehouse",
})
export class WarehousePipe implements PipeTransform {
  constructor(private warehouseService: WarehouseService) {}
  transform(id: number) {
    if (id === null || id === undefined) {
      return;
    }

    return this.warehouseService.getWarehouseById(id).pipe(
      map((response) => {
        if(response && response.name)
          return response.name;
        else 
          return '';
      }),
    );
  }
}
