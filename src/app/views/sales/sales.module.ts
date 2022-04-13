import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SalsCreateComponent } from "./sals-create/sals-create.component";
import { SalsListComponent } from "./sals-list/sals-list.component";
import { SalesRoutingModule } from "./sales-routing.module";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { SalsEditComponent } from "./sals-edit/sals-edit.component";

@NgModule({
  declarations: [SalsCreateComponent, SalsEditComponent, SalsListComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatAutocompleteModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    SharedPipesModule,
    SharedComponentsModule,
    SharedModule,
  ],
})
export class SalesModule {}
