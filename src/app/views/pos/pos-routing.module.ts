import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PosComponent } from "./pos/pos.component";

const routes: Routes = [
  {
    path: "pos",
    component: PosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class PosRoutingModule {}
