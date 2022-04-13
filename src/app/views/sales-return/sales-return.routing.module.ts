import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SaleEditReturnComponent } from "./sale-edit-return/sale-edit-return.component";
import { SalesAddReturnComponent } from "./sales-add-return/sales-add-return.component";
import { SalesReturnListComponent } from "./sales-return-list/sales-return-list.component";

const routes: Routes = [
  {
    path: "add",
    component: SalesAddReturnComponent,
  },
  {
    path: "edit/:id",
    component: SaleEditReturnComponent,
  },
  {
    path: "view",
    component: SalesReturnListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesReturnRoutingModule {}
