import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ExcelService } from "src/app/core/services/excel.service";
import { PaymentPurchaseReturnService } from "src/app/core/services/PaymentPurchaseReturn.service";
import { PDFService } from "src/app/core/services/pdf.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-purchase-return",
  templateUrl: "./purchase-return.component.html",
  styleUrls: ["./purchase-return.component.scss"],
})
export class PurchaseReturnComponent implements OnInit {
  @ViewChild("table") table: ElementRef;

  isLoader: boolean;
  paymentPurchaseReturns: any = [];
  constructor(
    private paymentPurchaseReturnService: PaymentPurchaseReturnService,
    private excelService: ExcelService,
    private pdfService: PDFService,
  ) {}

  ngOnInit(): void {
    this.getAllPaymentPurchaseReturn();
  }
  getAllPaymentPurchaseReturn() {
    this.isLoader = true;
    this.paymentPurchaseReturnService.getAllPaymentPurchaseReturn().subscribe(
      (response) => {
        console.log("paymentPurchaseReturns", response);
        this.isLoader = false;
        this.paymentPurchaseReturns = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  printExcel() {
    this.excelService.exportAsExcelFile(
      this.paymentPurchaseReturns,
      "payment_purchase_return",
    );
  }
  printPDF() {
    this.pdfService.printPDF(
      this.table.nativeElement,
      "payment_purchase_return",
    );
  }
}
