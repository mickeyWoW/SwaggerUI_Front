import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SalesAddReturnComponent } from "./sales-add-return/sales-add-return.component";
import { SalesReturnListComponent } from "./sales-return-list/sales-return-list.component";
import { SalesRoutingModule } from "../sales/sales-routing.module";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SalesReturnRoutingModule } from "./sales-return.routing.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { SaleEditReturnComponent } from "./sale-edit-return/sale-edit-return.component";

@NgModule({
  declarations: [
    SalesAddReturnComponent,
    SaleEditReturnComponent,
    SalesReturnListComponent,
  ],
  imports: [
    CommonModule,
    SalesReturnRoutingModule,
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
export class SalesReturnModule {}
