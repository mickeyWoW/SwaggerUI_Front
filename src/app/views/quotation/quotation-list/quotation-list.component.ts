import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DataTableDirective } from 'angular-datatables';
import {ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";
import { QuotationService } from "src/app/core/services/quotation.service";
import { ViewEncapsulation } from '@angular/core';
import Swal from "sweetalert2";
import { Subject } from "rxjs";

@Component({
  selector: "app-quotation-list",
  templateUrl: "./quotation-list.component.html",
  styleUrls: ["./quotation-list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class QuotationListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild("table") table: ElementRef;
  search: any;
  closeModal: string;
  
  closeResult: string = '';
  quotations: any = [];
  isLoader = false;
  deletedCount:any=0;
  constructor(
    private quotationService: QuotationService,
    private excelService: ExcelService,
    private pdfService: PDFService,
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10 
    };
    this.getAllQuotations();
  }
  
  getAllQuotations() {
    this.isLoader = true;
    this.quotationService.getAllQuotations().subscribe(
      (response) => {
        console.log("quotations ", response);
        this.quotations=[];
        this.dtTrigger.next();
        response.forEach((x) => {
          x.checkbox = false;
          this.quotations.push(x);
        });
        this.isLoader = false;
        //this.rerender();
      },
      (err) => {
        this.isLoader = false;
        Swal.fire("Error occured while fetching the quotations", "", "error");
        
      },);
  }
  delete(quotation) {
    Swal.fire({
      title: "Do you want to delete the quotation?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.quotationService.deleteQuotationById(quotation.id).subscribe(
          (response) => {
            this.isLoader = false;

            Swal.fire("Quotation deleted successfully", "", "success");
            this.getAllQuotations();
          },
          (err) => {
            this.isLoader = false;

            Swal.fire("Error occured while deleting the expense", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  DeleteMultipleQuotation() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.quotations,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.quotationService.DeleteMultipleQuotation(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllQuotations();
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
    this.excelService.exportAsExcelFile(this.quotations, "quotations");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "quotations");
  }
  
  checkAll(e) {
    console.log(e);
    if(e) {
      document.body.classList.add("checkAllbox");
    } 
    else
    {
      document.body.classList.remove("checkAllbox");
    }
    this.quotations.forEach((x) => {
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
    this.quotations[i].checkbox = !this.quotations[i].checkbox;
    var totalCount = 0
    $.each(this.quotations,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }
//   ngAfterViewInit(): void {
//     this.dtTrigger.next();
// }

// rerender(): void {
//     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//         // Destroy the table first
//         dtInstance.destroy();
//         // Call the dtTrigger to rerender again
//         this.dtTrigger.next();
//     });
// }
}
