import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpensesCreateComponent } from "./expenses-create/expenses-create.component";
import { ExpensesListComponent } from "./expenses-list/expenses-list.component";
import { ExpensesCategoryComponent } from "./expenses-category/expenses-category.component";
import { ExpensesRoutingModule } from "./expenses-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { SharedDirectivesModule } from "src/app/shared/directives/shared-directives.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { ExpensesEditComponent } from "./expenses-edit/expenses-edit.component";
import { DataTablesModule } from 'angular-datatables';
@NgModule({
  declarations: [
    ExpensesCreateComponent,
    ExpensesListComponent,
    ExpensesCategoryComponent,
    ExpensesEditComponent,
  ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    TranslateModule,
    NgbModule,
    SharedModule,
    SharedPipesModule,
    SharedDirectivesModule,
    SharedComponentsModule,
    DataTablesModule,
  ],
})
export class ExpensesModule {}
