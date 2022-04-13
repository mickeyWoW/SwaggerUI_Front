import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PurchaseEditComponent } from "./purchase-edit/purchase-edit.component";
import { PurchasesAddComponent } from "./purchases-add/purchases-add.component";
import { PurchasesListComponent } from "./purchases-list/purchases-list.component";

const routes: Routes = [
  {
    path: "add",
    component: PurchasesAddComponent,
  },
  {
    path: "edit/:id",
    component: PurchaseEditComponent,
  },
  {
    path: "view",
    component: PurchasesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesRoutingModule {}
