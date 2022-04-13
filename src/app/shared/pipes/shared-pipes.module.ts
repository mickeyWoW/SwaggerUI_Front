import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExcerptPipe } from "./excerpt.pipe";
import { GetValueByKeyPipe } from "./get-value-by-key.pipe";
import { RelativeTimePipe } from "./relative-time.pipe";
import { CategoryPipe } from "./category.pipe";
import { BrandPipe } from "./brand.pipe";
import { WarehousePipe } from "./warehouse.pipe";
import { UserPipe } from "./user.pipe";
import { ImagePipe } from "./image.pipe";
import { ExpenseCategoryPipe } from "./expense-category.pipe";
import { CustomerPipe } from "./customer.pipe";
import { SupplierPipe } from "./suppliers.pipe";
import { UnitPipe } from "./unit.pipe";

const pipes = [
  ExcerptPipe,
  GetValueByKeyPipe,
  RelativeTimePipe,
  BrandPipe,
  CategoryPipe,
  WarehousePipe,
  UserPipe,
  ImagePipe,
  ExpenseCategoryPipe,
  CustomerPipe,
  SupplierPipe,
  UnitPipe,
];

@NgModule({
  imports: [CommonModule],
  declarations: pipes,
  exports: pipes,
})
export class SharedPipesModule {}
