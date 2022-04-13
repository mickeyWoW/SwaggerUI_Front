import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranferCreateComponent } from "./tranfer-create/tranfer-create.component";
import { TranferListComponent } from "./tranfer-list/tranfer-list.component";
import { TransferListRoutingModule } from "./transfer-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedDirectivesModule } from "src/app/shared/directives/shared-directives.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { TransferEditComponent } from "./transfer-edit/transfer-edit.component";
import { DataTablesModule } from 'angular-datatables';
@NgModule({
  declarations: [
    TranferCreateComponent,
    TransferEditComponent,
    TranferListComponent,
  ],
  imports: [
    CommonModule,
    TransferListRoutingModule,
    NgbModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    SharedModule,
    SharedDirectivesModule,
    SharedPipesModule,
    SharedComponentsModule,
    DataTablesModule,
  ],
})
export class TransferModule {}
