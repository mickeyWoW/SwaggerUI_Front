import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";
import { SalesService } from "src/app/core/services/sales.service";
import Swal from "sweetalert2";
import {ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: "app-sals-list",
  templateUrl: "./sals-list.component.html",
  styleUrls: ["./sals-list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SalsListComponent implements OnInit {
  @ViewChild("table") table: ElementRef;
  form: FormGroup;
  isLoader = false;
  closeModal: string;
  closeResult: string = '';
  sales: any = [];
  search: any;
  deletedCount:any=0;
  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
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
    this.createForm();
    this.getAllSales();
  }
  createForm() {
    this.form = this.fb.group({});
  }

  getAllSales(): void {
    this.isLoader = true;
    this.salesService.getAllSales().subscribe(
      (response) => {
        console.log("warehouses", response);
        this.sales=[];
        this.isLoader = false;

        response.forEach((x) => {
          x.checkbox = false;
          this.sales.push(x);
        });
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  delete(sale) {
    Swal.fire({
      title: "Do you want to delete the sale?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.salesService.deleteSalesById(sale.id).subscribe(
          (response) => {
            this.isLoader = false;

            Swal.fire("Sale deleted successfully", "", "success");
            this.getAllSales();
          },
          (err) => {
            this.isLoader = false;

            Swal.fire("Error occured while deleting the sale", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }

  DeleteMultipleSale() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.sales,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.salesService.DeleteMultipleSale(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllSales();
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
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "sales_returns");
  }
  printExcel() {
    this.excelService.exportAsExcelFile(this.sales, "sales_returns");
  }
  // checkAll(e) {
  //   console.log(e);
  //   this.sales.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.sales[i].checkbox = !this.sales[i].checkbox;
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
    this.sales.forEach((x) => {
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
    this.sales[i].checkbox = !this.sales[i].checkbox;
    var totalCount = 0
    $.each(this.sales,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }
}
