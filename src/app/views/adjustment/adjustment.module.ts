import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdjustmentCreateComponent } from "./adjustment-create/adjustment-create.component";
import { AdjustmentListComponent } from "./adjustment-list/adjustment-list.component";
import { AdjustmentRoutingModule } from "./adjustment-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPaginationModule } from "ngx-pagination";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { AdjustmentEditComponent } from "./adjustment-edit/adjustment-edit.component";
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    AdjustmentCreateComponent,
    AdjustmentEditComponent,
    AdjustmentListComponent,
  ],
  imports: [
    CommonModule,
    AdjustmentRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    TranslateModule,
    SharedModule,
    SharedComponentsModule,
    SharedPipesModule,
    DataTablesModule,
  ],
})
export class AdjustmentModule {}
