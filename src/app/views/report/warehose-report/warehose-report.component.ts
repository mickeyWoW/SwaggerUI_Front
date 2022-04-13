import { Component, OnInit } from "@angular/core";
import { id } from "@swimlane/ngx-datatable";
import { ExpenseService } from "src/app/core/services/expense.service";
import { PurchaseService } from "src/app/core/services/purchase.service";
import { PurchaseReturnService } from "src/app/core/services/purchaseReturn.service";
import { QuotationService } from "src/app/core/services/quotation.service";
import { SalesReturnService } from "src/app/core/services/saleReturn.service";
import { SalesService } from "src/app/core/services/sales.service";
import { WarehouseService } from "src/app/core/services/warehouse.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-warehose-report",
  templateUrl: "./warehose-report.component.html",
  styleUrls: ["./warehose-report.component.scss"],
})
export class WarehoseReportComponent implements OnInit {
  items = [
    {
      name: "Quotation",
    },
    {
      name: "Sales",
    },
    {
      name: "Sales Return",
    },
    {
      name: "Purchase Return",
    },
    {
      name: "Expenses",
    },
  ];
  currentName = "Quotation";
  isLoader: boolean;
  warehouses: any;
  salesReport: any = [];
  purchaseReport: any = [];
  purchaseReturnReport: any = [];
  salesReturnReport: any = [];
  quotationReport: any = [];
  expensesReport: any = [];
  warehouseId: any;
  constructor(
    private warehouseService: WarehouseService,
    private salesService: SalesService,
    private purchaseService: PurchaseService,
    private purchaseReturnService: PurchaseReturnService,
    private salesReturnService: SalesReturnService,
    private quotationService: QuotationService,
    private expenseService: ExpenseService,
  ) {}

  ngOnInit(): void {
    this.getAllWarehouses();
    // this.getSalesReport(this.warehouseId);
    // this.getPurchaseReport(this.warehouseId);
    // this.getPurchaseReturnReport(this.warehouseId);
    // this.getSalesReturnReport(this.warehouseId);
  }
  changeTab(name) {
    console.log(name);
    this.currentName = name.name;
  }
  getAllWarehouses() {
    this.isLoader = true;
    this.warehouseService.getAllWarehouses().subscribe(
      (response) => {
        this.isLoader = false;
        console.log("warehouses", response);
        this.warehouses = response;
        this.warehouseId = this.warehouses[0].id;
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getSalesReport(id) {
    this.salesService.getSalesByWarehouseId(id).subscribe((response) => {
      console.log("salesReport", response);
      this.salesReport = response;
    });
  }
  getPurchaseReport(id) {
    this.purchaseService.getPurchaseByWarehouseId(id).subscribe((response) => {
      console.log("purchaseReport", response);
      this.purchaseReport = response;
    });
  }
  getPurchaseReturnReport(id) {
    this.purchaseReturnService
      .getPurchaseReturnByWarehouseId(id)
      .subscribe((response) => {
        console.log("purchaseReturnReport", response);
        this.purchaseReturnReport = response;
      });
  }
  getSalesReturnReport(id) {
    this.salesReturnService
      .getSalesReturnByWarehouseId(id)
      .subscribe((response) => {
        console.log("salesReturnReport", response);
        this.salesReturnReport = response;
      });
  }
  getQuotationsReport(id) {
    this.quotationService
      .getQuotationByWarehouseId(id)
      .subscribe((response) => {
        console.log("quotationReport", response);
        this.quotationReport = response;
      });
  }
  getExpensesReport(id) {
    this.expenseService.getExpenseByWarehouseId(id).subscribe((response) => {
      console.log("expensesReport", response);
      this.expensesReport = response;
    });
  }
  onWarehouseChange(e) {
    console.log(e);
    this.getSalesReport(e.id);
    this.getPurchaseReport(e.id);
    this.getPurchaseReturnReport(e.id);
    this.getSalesReturnReport(e.id);
    this.getQuotationsReport(e.id);
    this.getExpensesReport(e.id);
  }
}
