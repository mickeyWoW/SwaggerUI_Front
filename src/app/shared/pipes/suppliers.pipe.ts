import { Pipe, PipeTransform } from "@angular/core";
import { map } from "rxjs/operators";
import { ProvidersService } from "src/app/core/services/providers.service";

@Pipe({
  name: "Supplier",
})
export class SupplierPipe implements PipeTransform {
  constructor(private providerService: ProvidersService) {}
  transform(id: number) {
    console.log(id);
    if (id === null || id === undefined) {
      return;
    }

    return this.providerService.getProviderById(id).pipe(
      map((response) => {
        console.log(response);
        return response.name;
      }),
    );
  }
}
