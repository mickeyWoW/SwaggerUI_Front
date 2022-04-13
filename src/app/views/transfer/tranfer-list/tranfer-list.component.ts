import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import {ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "src/app/core/services/excel.service";
import { TransferService } from "src/app/core/services/transfer.service";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PDFService } from "src/app/core/services/pdf.service";
import { ViewEncapsulation } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";
import{FilterTransferModel}from '../FilterTransferModel';
import { WarehouseService } from "../../../core/services/warehouse.service";
@Component({
  selector: "app-tranfer-list",
  templateUrl: "./tranfer-list.component.html",
  styleUrls: ["./tranfer-list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TranferListComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild("table") table: ElementRef;
  search: any;
  searchControl: FormControl = new FormControl();
  closeModal: string;
  form: FormGroup;
  isLoader: boolean;
  transfers: any = [];
  closeResult: string = '';
  deletedCount: any = 0;
  referance:any='';
  selecteFromWarehouse:any='';
  selecteToWarehouse:any='';
  selecteStatus:any='';
  searchTransferData:any=[];
  searchdata: FilterTransferModel={} as any;
   constructor(
    private transferService: TransferService,
    private fb: FormBuilder,
    private excelService: ExcelService,
    private pdfService: PDFService,
    private modalService: NgbModal,
    private warehouseService:WarehouseService,
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
      pageLength: 5,
      processing: true
    };

    this.createForm();
    this.getAllTransfers();
    this.getFromWarehouse();
    this.getToWarehouse();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  createForm() {
    this.form = this.fb.group({
      from_warehouse_id: [null, Validators.required],
      to_warehouse_id: [null, Validators.required],
      taxNet: [null, Validators.required],
      shipping: [null, Validators.required],
      discount: [null, Validators.required],
      date: [null, Validators.required].toString(),
      notes: [null, Validators.required],
      statut: [null, Validators.required],
      items: [null, Validators.required],
      grandTotal: [null, Validators.required],
    });
  }
  getAllTransfers() {
    this.isLoader = true;
    this.transferService.getAllTransfers().subscribe(
      (response) => {
        console.log("transfers", response);
        this.transfers=[];
        this.isLoader = false;
        this.dtTrigger.next();
        response.forEach((x) => {
          x.checkbox = false;
          this.transfers.push(x);
        });
      },
      (error) => {
        this.isLoader = false;
      
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
 
  getFilteredData() {
    if (this.transfers.length > 0) {
      this.isLoader = true;
      this.searchdata.searchString = this.search;
      this.searchdata.fromWareHouse = this.selecteFromWarehouse ? this.selecteFromWarehouse : '';
      this.searchdata.toWareHouse = this.selecteToWarehouse ? this.selecteToWarehouse : '';
      this.searchdata.statut = this.selecteStatus ? this.selecteStatus : '';
      this.transferService.getTransferByFilters(this.searchdata.referance, this.searchdata.fromWareHouse, this.searchdata.toWareHouse, this.searchdata.statut).subscribe(
          (response) => {
            if (response) {
    
              //this.total = response.Total;
              this.transfers = [];
              this.transfers = response;
    
              this.transfers.forEach(x => {
                x.checkbox = false;
              });
    
              this.isLoader = false;
            }
          },
          (error) => {
            this.isLoader = false;
            Swal.fire("Error occured while retrieving the list", "", "error");
          },
        );

    }
    else if (this.transfers.length == 0) {
      this.getAllTransfers();
    }
  }
  ResetTrasferData()
  {
    this.referance = '';
    this.selecteFromWarehouse = '';
    this.selecteToWarehouse= '';
    this.selecteStatus = '';
    this.modalService.dismissAll();
    this.getAllTransfers();
  }
  
  delete(transfer) {
    Swal.fire({
      title: "Do you want to delete the transfer?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.transferService.deleteTransferById(transfer.id).subscribe(
          (response) => {
            this.getAllTransfers();
            console.log("transfer", response);
            Swal.fire("Deleted!", "", "success");
          },
          (err) => {
            console.log(err);
            Swal.fire("Error occured while deleting", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }

  DeleteMultipleTransfer() {
    Swal.fire({
  title: "Do you want to delete the product?",
  showCancelButton: true,
  confirmButtonText: "Delete",
  denyButtonText: `Cancel`,
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    var ids = [];
    $.each(this.transfers,function(i,obj) {
        if(obj.checkbox)
          ids.push(obj.id);
    });
    this.isLoader = true;
    this.transferService.DeleteMultipleTransfer(ids).subscribe(
      (response) => {
        if(response)
        {
          this.getAllTransfers();
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
    this.excelService.exportAsExcelFile(this.transfers, "transfers");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "transfers");
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
    this.transfers.forEach((x) => {
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
    this.transfers[i].checkbox = !this.transfers[i].checkbox;
    var totalCount = 0
    $.each(this.transfers,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }

  getFromWarehouse() {
    this.warehouseService.getAllWarehouses().subscribe(
      (response) => {
        if (response) {
          this.searchTransferData = response;
        }
      },
      (error) => {

        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  
  getToWarehouse() {
    this.warehouseService.getAllWarehouses().subscribe(
      (response) => {
        if (response) {
          this.searchTransferData = response;
        }
      },
      (error) => {

        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getStatus()
  {

  }
}
