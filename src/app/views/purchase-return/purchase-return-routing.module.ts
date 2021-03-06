import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PurchaseEditComponent } from "../purchases/purchase-edit/purchase-edit.component";
import { PurchaseReturnAddComponent } from "./purchase-return-add/purchase-return-add.component";
import { PurchaseReturnListComponent } from "./purchase-return-list/purchase-return-list.component";

const routes: Routes = [
  {
    path: "add",
    component: PurchaseReturnAddComponent,
  },
  {
    path: "edit/:id",
    component: PurchaseEditComponent,
  },
  {
    path: "view",
    component: PurchaseReturnListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseReturnRoutingModule {}
