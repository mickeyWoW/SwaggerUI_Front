import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";
import { SalesService } from "src/app/core/services/sales.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-sale-report",
  templateUrl: "./sale-report.component.html",
  styleUrls: ["./sale-report.component.scss"],
})
export class SaleReportComponent implements OnInit {
  @ViewChild("table") table: ElementRef;

  isLoader: boolean;
  salesReport: any;
  constructor(
    private salesService: SalesService,
    private excelService: ExcelService,
    private pdfService: PDFService,
  ) {}

  ngOnInit(): void {
    this.getAllSales();
  }
  getAllSales(): void {
    this.isLoader = true;
    this.salesService.getAllSales().subscribe(
      (response) => {
        console.log("salesReport", response);
        this.isLoader = false;
        this.salesReport = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  printExcel() {
    this.excelService.exportAsExcelFile(this.salesReport, "sales_report");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "sales_report");
  }
}
