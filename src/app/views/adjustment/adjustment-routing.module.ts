import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdjustmentCreateComponent } from "./adjustment-create/adjustment-create.component";
import { AdjustmentEditComponent } from "./adjustment-edit/adjustment-edit.component";
import { AdjustmentListComponent } from "./adjustment-list/adjustment-list.component";

const routes: Routes = [
  {
    path: "add",
    component: AdjustmentCreateComponent,
  },
  {
    path: "edit/:id",
    component: AdjustmentEditComponent,
  },
  {
    path: "view",
    component: AdjustmentListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdjustmentRoutingModule {}
