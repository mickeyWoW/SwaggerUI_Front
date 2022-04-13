import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ExcelService } from "src/app/core/services/excel.service";
import { PaymentSalesService } from "src/app/core/services/paymentSales.service";
import { PDFService } from "src/app/core/services/pdf.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
})
export class SalesComponent implements OnInit {
  @ViewChild("table") table: ElementRef;
  isLoader: boolean;
  paymentSales: any = [];
  search: any;
  constructor(
    private paymentSalesService: PaymentSalesService,
    private excelService: ExcelService,
    private pdfService: PDFService,
  ) {}

  ngOnInit(): void {
    this.getAllSalesPayment();
  }
  getAllSalesPayment() {
    this.isLoader = true;
    this.paymentSalesService.getAllSalesPayment().subscribe(
      (response) => {
        console.log("paymentSales", response);
        this.isLoader = false;
        this.paymentSales = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  printExcel() {
    this.excelService.exportAsExcelFile(this.paymentSales, "paymentSales");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "paymentSales");
  }
}
