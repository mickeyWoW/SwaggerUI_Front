import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { SharedModule } from "src/app/shared/shared.module";
import { PurchaseReturnAddComponent } from "./purchase-return-add/purchase-return-add.component";
import { PurchaseReturnEditComponent } from "./purchase-return-edit/purchase-return-edit.component";
import { PurchaseReturnListComponent } from "./purchase-return-list/purchase-return-list.component";
import { PurchaseReturnRoutingModule } from "./purchase-return-routing.module";

@NgModule({
  declarations: [
    PurchaseReturnAddComponent,
    PurchaseReturnEditComponent,
    PurchaseReturnListComponent,
  ],
  imports: [
    CommonModule,
    PurchaseReturnRoutingModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatMenuModule,
    NgbModule,
    SharedModule,
    SharedComponentsModule,
    SharedPipesModule,
  ],
})
export class PurchaseReturnModule {}
