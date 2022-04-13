import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ExcelService } from "src/app/core/services/excel.service";
import { PaymentPurchaseReturnService } from "src/app/core/services/PaymentPurchaseReturn.service";
import { PDFService } from "src/app/core/services/pdf.service";
import { PurchaseReturnService } from "src/app/core/services/purchaseReturn.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-purchase-return-list",
  templateUrl: "./purchase-return-list.component.html",
  styleUrls: ["./purchase-return-list.component.scss"],
})
export class PurchaseReturnListComponent implements OnInit {
  @ViewChild("table") table: ElementRef;
  search = null;
  isLoader: boolean;
  purchaseReturns: any = [];
  deletedCount:any=0;
  constructor(
    private purchaseReturnService: PurchaseReturnService,
    private excelService: ExcelService,
    private pdfService: PDFService,
  ) {}

  ngOnInit(): void {
    this.getAllPurchaseReturns();
  }
  getAllPurchaseReturns() {
    this.isLoader = true;
    this.purchaseReturnService.getAllPurchaseReturns().subscribe(
      (response) => {
        console.log("purchaseReturns", response);
        this.purchaseReturns=[];
        this.isLoader = false;
        // this.purchaseReturns = response;
        response.forEach((x) => {
          x.checkbox = false;
          this.purchaseReturns.push(x);
        });
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  delete(purchaseReturn) {
    Swal.fire({
      title: "Do you want to delete the purchase return?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.purchaseReturnService
          .deletePurchaseById(purchaseReturn.id)
          .subscribe(
            (response) => {
              this.isLoader = false;

              Swal.fire("Purchase Return deleted successfully", "", "success");
              this.getAllPurchaseReturns();
            },
            (err) => {
              this.isLoader = false;

              Swal.fire(
                "Error occured while deleting the purchase return",
                "",
                "error",
              );
            },
          );
      } else if (result.isDenied) {
      }
    });
  }
  DeleteMultiplePurchaseReturn() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.purchaseReturns,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.purchaseReturnService.DeleteMultiplePurchaseReturn(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllPurchaseReturns();
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
    this.pdfService.printPDF(this.table.nativeElement, "purchaseReturns");
  }
  printExcel() {
    this.excelService.exportAsExcelFile(
      this.purchaseReturns,
      "purchaseReturns",
    );
  }
  // checkAll(e) {
  //   console.log(e);
  //   this.purchaseReturns.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.purchaseReturns[i].checkbox = !this.purchaseReturns[i].checkbox;
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
    this.purchaseReturns.forEach((x) => {
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
    this.purchaseReturns[i].checkbox = !this.purchaseReturns[i].checkbox;
    var totalCount = 0
    $.each(this.purchaseReturns,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }
}
