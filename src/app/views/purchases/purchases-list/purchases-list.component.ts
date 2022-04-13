import { PurchaseService } from "src/app/core/services/purchase.service";
import Swal from "sweetalert2";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import {ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: "app-purchases-list",
  templateUrl: "./purchases-list.component.html",
  styleUrls: ["./purchases-list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PurchasesListComponent implements OnInit {
  @ViewChild("table") table: ElementRef;
  search: any;
  closeModal: string;
  closeResult: string = '';
  isLoader = false;
  purchases: any = [];
  deletedCount:any=0;
  constructor(
    private purchaseService: PurchaseService,
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
    this.getAllPurchases();
  }
  getAllPurchases() {
    this.isLoader = true;
    this.purchaseService.getAllPurchases().subscribe(
      (response) => {
        console.log("purchase", response);
       this.purchases=[];
        response.forEach((x) => {
          x.checkbox = false;
          this.purchases.push(x);
        });
        this.isLoader = false;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  delete(purchase) {
    Swal.fire({
      title: "Do you want to delete the purchase?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.purchaseService.deletePurchaseById(purchase.id).subscribe(
          (response) => {
            this.isLoader = false;

            Swal.fire("Purchase deleted successfully", "", "success");
            this.getAllPurchases();
          },
          (err) => {
            this.isLoader = false;

            Swal.fire("Error occured while deleting the purchase", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  DeleteMultiplePurchase() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.purchases,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.purchaseService.DeleteMultiplePurchase(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllPurchases();
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
    this.excelService.exportAsExcelFile(this.purchases, "purchases");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "purchases");
  }
  // checkAll(e) {
  //   console.log(e);
  //   this.purchases.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.purchases[i].checkbox = !this.purchases[i].checkbox;
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
    this.purchases.forEach((x) => {
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
    this.purchases[i].checkbox = !this.purchases[i].checkbox;
    var totalCount = 0
    $.each(this.purchases,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }
}
