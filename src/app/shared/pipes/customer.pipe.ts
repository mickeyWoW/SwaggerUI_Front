import { Pipe, PipeTransform } from "@angular/core";
import { map } from "rxjs/operators";
import { CustomerService } from "src/app/core/services/customer.service";

@Pipe({
  name: "Customer",
})
export class CustomerPipe implements PipeTransform {
  constructor(private customerService: CustomerService) {}
  transform(id: number) {
    console.log(id);
    if (id === null || id === undefined) {
      return;
    }

    return this.customerService.getCustomerById(id).pipe(
      map((response) => {
        console.log(response);
        return response.name;
      }),
    );
  }
}
