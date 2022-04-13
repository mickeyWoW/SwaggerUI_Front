import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddProductComponent } from "./add-product/add-product.component";
import { ViewProductComponent } from "./view-product/view-product.component";
import { BarcodeComponent } from "./barcode/barcode.component";
import { ProductRoutingModule } from "./product-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPaginationModule } from "ngx-pagination";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { FileUploadModule } from 'ng2-file-upload';
//import {  sortDirective} from '../product/view-product/sort.directive';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    AddProductComponent,
    EditProductComponent,
    ViewProductComponent,
    BarcodeComponent,
    //sortDirective,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedComponentsModule,
    SharedModule,
    SharedPipesModule,
    NgbModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    MatSelectModule,
    MatFormFieldModule,
    TranslateModule,
    FileUploadModule,
    DataTablesModule
  ],
})
export class ProductModule {



}
