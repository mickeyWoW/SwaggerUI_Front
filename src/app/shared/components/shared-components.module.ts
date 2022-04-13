import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BtnLoadingComponent } from "./btn-loading/btn-loading.component";
import { FeatherIconComponent } from "./feather-icon/feather-icon.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { SharedPipesModule } from "../pipes/shared-pipes.module";
import { SearchModule } from "./search/search.module";
import { SharedDirectivesModule } from "../directives/shared-directives.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { LayoutsModule } from "./layouts/layouts.module";
import { LoadersComponent } from "./loader/loaders.component";
import { ErrorsComponent } from "./errors/errors.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { TranslateModule } from "@ngx-translate/core";

const components = [
  BtnLoadingComponent,
  FeatherIconComponent,
  LoadersComponent,
  ErrorsComponent,
  PaginationComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    SearchModule,
    PerfectScrollbarModule,
    NgbModule,
    TranslateModule
  ],
  declarations: components,
  exports: components,
})
export class SharedComponentsModule {}
