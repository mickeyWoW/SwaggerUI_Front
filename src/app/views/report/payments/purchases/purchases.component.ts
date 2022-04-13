import { PaymentPurchaseService } from "src/app/core/services/PaymentPurchase.service";
import Swal from "sweetalert2";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";

@Component({
  selector: "app-purchases",
  templateUrl: "./purchases.component.html",
  styleUrls: ["./purchases.component.scss"],
})
export class PurchasesComponent implements OnInit {
  @ViewChild("table") table: ElementRef;

  isLoader: boolean;
  paymentPurchases: any = [];
  constructor(
    private paymentPurchaseService: PaymentPurchaseService,
    private excelService: ExcelService,
    private pdfService: PDFService,
  ) {}

  ngOnInit(): void {
    this.getAllPaymentPurchases();
  }
  getAllPaymentPurchases() {
    this.isLoader = true;
    this.paymentPurchaseService.getAllPaymentPurchases().subscribe(
      (response) => {
        console.log("paymentPurchases", response);
        this.isLoader = false;
        this.paymentPurchases = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  printExcel() {
    this.excelService.exportAsExcelFile(
      this.paymentPurchases,
      "payment_purchases",
    );
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "payment_purchases");
  }
}
