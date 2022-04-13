import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";
import { PaymentSalesReturnService } from "src/app/core/services/paymentSalesReturn.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-sales-return",
  templateUrl: "./sales-return.component.html",
  styleUrls: ["./sales-return.component.scss"],
})
export class SalesReturnComponent implements OnInit {
  @ViewChild("table") table: ElementRef;
  search: any;
  isLoader: boolean;
  paymentSalesReturns: any = [];
  constructor(
    private paymentSalesReturnService: PaymentSalesReturnService,
    private excelService: ExcelService,
    private pdfService: PDFService,
  ) {}

  ngOnInit(): void {
    this.getAllSalesReturnPayment();
  }
  getAllSalesReturnPayment() {
    this.isLoader = true;
    this.paymentSalesReturnService.getAllSalesReturnPayment().subscribe(
      (response) => {
        console.log("paymentSalesReturns", response);
        this.isLoader = false;
        this.paymentSalesReturns = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  printExcel() {
    this.excelService.exportAsExcelFile(
      this.paymentSalesReturns,
      "payment_sales_return",
    );
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "payment_sales_return");
  }
}
