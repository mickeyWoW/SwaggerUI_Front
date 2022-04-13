import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuotationCreateComponent } from "./quotation-create/quotation-create.component";
import { QuotationListComponent } from "./quotation-list/quotation-list.component";
import { QuotationRoutingModule } from "./quotation-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedDirectivesModule } from "src/app/shared/directives/shared-directives.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { QuotationEditComponent } from "./quotation-edit/quotation-edit.component";
import { DataTablesModule } from 'angular-datatables';
@NgModule({
  declarations: [
    QuotationCreateComponent,
    QuotationEditComponent,
    QuotationListComponent,
  ],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    NgbModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    SharedModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    SharedPipesModule,
    DataTablesModule,
  ],
})
export class QuotationModule {}
