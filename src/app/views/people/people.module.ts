import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { SupplierListComponent } from "./supplier-list/supplier-list.component";
import { UserListComponent } from "./user-list/user-list.component";
import { PeopleRoutingModule } from "./peope-routing.module";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { SharedDirectivesModule } from "src/app/shared/directives/shared-directives.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { DataTablesModule } from 'angular-datatables';
@NgModule({
  declarations: [
    CustomerListComponent,
    SupplierListComponent,
    UserListComponent,
  ],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    SharedModule,
    SharedPipesModule,
    SharedDirectivesModule,
    SharedComponentsModule,
    DataTablesModule,
  ],
})
export class PeopleModule {}
