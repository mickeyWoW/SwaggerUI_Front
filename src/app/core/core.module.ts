import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiService } from "./services/api.service";
import { UserService } from ".";
import { ProductService } from "./services/product.service";
import { CategoryService } from "./services/category.service";
import { TokenService } from "./services/authToken.service";
import { BrandService } from "./services/brand.service";
import { SalesService } from "./services/sales.service";
import { WarehouseService } from "./services/warehouse.service";
import { AdjustmentService } from "./services/adjustment.service";
import { TransferService } from "./services/transfer.service";
import { ExpenseService } from "./services/expense.service";
import { ExpenseCategoriesService } from "./services/expense-categories.service";
import { QuotationService } from "./services/quotation.service";
import { PaymentPurchaseService } from "./services/PaymentPurchase.service";
import { UnitService } from "./services/unit.service";
import { PurchaseService } from "./services/purchase.service";
import { CustomerService } from "./services/customer.service";
import { RolesService } from "./services/roles.service";
import { CurrencyService } from "./services/currency.service";
import { SettingsService } from "./services/settings.service";
import { PurchaseReturnService } from "./services/purchaseReturn.service";
import { SalesReturnService } from "./services/saleReturn.service";
import { PaymentSalesService } from "./services/paymentSales.service";
import { PaymentSalesReturnService } from "./services/paymentSalesReturn.service";
import { PaymentPurchaseReturnService } from "./services/PaymentPurchaseReturn.service";
import { AdjustmentDetailsService } from "./services/adjustmentDetails.service";
import { ExcelService } from "./services/excel.service";
import { PDFService } from "./services/pdf.service";
import { ProvidersService } from "./services/providers.service";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [],
  providers: [
    ApiService,
    TokenService,
    CategoryService,
    ProductService,
    AdjustmentService,
    AdjustmentDetailsService,
    TransferService,
    UserService,
    BrandService,
    SalesService,
    PaymentPurchaseService,
    UnitService,
    WarehouseService,
    ExpenseService,
    ExpenseCategoriesService,
    QuotationService,
    PurchaseService,
    CustomerService,
    RolesService,
    CurrencyService,
    SettingsService,
    PurchaseReturnService,
    SalesReturnService,
    PaymentSalesService,
    PaymentSalesReturnService,
    PaymentPurchaseReturnService,
    ExcelService,
    PDFService,
    ProvidersService,
  ],
})
export class CoreModule {}
