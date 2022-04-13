import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PosComponent } from "./pos/pos.component";
import { PosRoutingModule } from "./pos-routing.module";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatMenuModule } from "@angular/material/menu";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";

@NgModule({
  declarations: [PosComponent],
  imports: [
    CommonModule,
    PosRoutingModule,
    MatSidenavModule,
    MatMenuModule,
    SharedModule,
    SharedComponentsModule,
    SharedPipesModule,
  ],
})
export class PosModule {}
