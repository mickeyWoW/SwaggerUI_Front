import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";
import { SalesReturnService } from "src/app/core/services/saleReturn.service";
import Swal from "sweetalert2";
import {ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: "app-sales-return-list",
  templateUrl: "./sales-return-list.component.html",
  styleUrls: ["./sales-return-list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SalesReturnListComponent implements OnInit {
  @ViewChild("table") table: ElementRef;
  isLoader = false;
  salesReturns: any = [];
  search = null;
  closeModal: string;
  closeResult: string = '';
  deletedCount:any=0;
  constructor(
    private salesReturnService: SalesReturnService,
    private pdfService: PDFService,
    private excelService: ExcelService,
    private modalService: NgbModal,
  ) {}
  open(content:any) {
    this.modalService.open(content, { windowClass: 'b-sidebar shadow b-sidebar-right bg-white text-dark'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.getAllSalesReturn();
  }
  getAllSalesReturn() {
    this.isLoader = true;
    this.salesReturnService.getAllSalesReturn().subscribe(
      (response) => {
        console.log("paymentSalesReturns", response);
        this.salesReturns=[];
        response.forEach((x) => {
          x.checkbox = false;
          this.salesReturns.push(x);
        });
        this.isLoader = false;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  delete(saleReturn) {
    Swal.fire({
      title: "Do you want to delete the sale return?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.salesReturnService.deleteSalesReturn(saleReturn.id).subscribe(
          (response) => {
            this.isLoader = false;

            Swal.fire("Sale Return deleted successfully", "", "success");
            this.getAllSalesReturn();
          },
          (err) => {
            this.isLoader = false;

            Swal.fire(
              "Error occured while deleting the sale return",
              "",
              "error",
            );
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  DeleteMultipleSaleReturn() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.salesReturns,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.salesReturnService.DeleteMultipleSaleReturn(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllSalesReturn();
              this.isLoader = false;
            }
          },
          (error) => {
            this.isLoader = false;
            Swal.fire("Error occured while deleting!", "", "error");
          },
        );
        Swal.fire("Deleted!", "", "success");
      } else if (result.isDenied) {
      }
    });
  }
  printExcel() {
    this.excelService.exportAsExcelFile(this.salesReturns, "sales_returns");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "sales_returns");
  }
  // checkAll(e) {
  //   console.log(e);
  //   this.salesReturns.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.salesReturns[i].checkbox = !this.salesReturns[i].checkbox;
  // }
  checkAll(e) {
    console.log(e);
    if(e) {
      document.body.classList.add("checkAllbox");
    } 
    else
    {
      document.body.classList.remove("checkAllbox");
    }
    this.salesReturns.forEach((x) => {
      x.checkbox = e;
    });
  }
  
  checkSingle(i) {
    if(i) {
      document.body.classList.add("checkAllbox");
    } 
    else if("")
    {
      document.body.classList.remove("checkAllbox");
    }
    this.salesReturns[i].checkbox = !this.salesReturns[i].checkbox;
    var totalCount = 0
    $.each(this.salesReturns,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }
}
