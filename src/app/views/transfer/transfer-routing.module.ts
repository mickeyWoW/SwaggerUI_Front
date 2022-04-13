import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TranferCreateComponent } from "./tranfer-create/tranfer-create.component";
import { TranferListComponent } from "./tranfer-list/tranfer-list.component";
import { TransferEditComponent } from "./transfer-edit/transfer-edit.component";

const routes: Routes = [
  {
    path: "add",
    component: TranferCreateComponent,
  },
  {
    path: "edit/:id",
    component: TransferEditComponent,
  },
  {
    path: "view",
    component: TranferListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferListRoutingModule {}
