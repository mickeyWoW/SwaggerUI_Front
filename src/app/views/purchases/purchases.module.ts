import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PurchasesAddComponent } from "./purchases-add/purchases-add.component";
import { PurchasesListComponent } from "./purchases-list/purchases-list.component";
import { PurchasesRoutingModule } from "./purchases-routing.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { SharedDirectivesModule } from "src/app/shared/directives/shared-directives.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { PurchaseEditComponent } from "./purchase-edit/purchase-edit.component";

@NgModule({
  declarations: [
    PurchasesAddComponent,
    PurchaseEditComponent,
    PurchasesListComponent,
  ],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgbModule,
    SharedModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    SharedPipesModule,
  ],
})
export class PurchasesModule {}
