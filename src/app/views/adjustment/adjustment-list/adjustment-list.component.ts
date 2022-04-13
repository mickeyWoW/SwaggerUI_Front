import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AdjustmentService } from "src/app/core/services/adjustment.service";
import {ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";
import { ViewEncapsulation } from '@angular/core';
import Swal from "sweetalert2";
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";
import * as XLSX from "xlsx";
import { WarehouseService } from "../../../core/services/warehouse.service";
import{FilterAdjustmentModel} from '../FilterAdjustmentModel';
@Component({
  selector: "app-adjustment-list",
  templateUrl: "./adjustment-list.component.html",
  styleUrls: ["./adjustment-list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AdjustmentListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  
  
  @ViewChild("table") table: ElementRef;
  @ViewChild("inputFile") inputFile: ElementRef;
  keys: string[];
  dataSheet = new Subject();
  search: any;
  closeModal: string;
  searchControl: FormControl = new FormControl();
  adjustments: any = [];
  closeResult: string = '';
  isLoader = false;
  deletedCount: any = 0;
  isExcelFile: boolean;
  
  warehouse:any=[];
  optionSelectedwarehouse: any;
  searchRef:string='';
  searchDate:string='';
  searchdata: FilterAdjustmentModel = {} as any;
  constructor(
    private adjustmentService: AdjustmentService,
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
      pageLength: 10 
    };
    this.getAllAdjustments();
    this.getAllWarehouse();
  }

  getAllAdjustments() {
    this.isLoader = true;
    this.adjustmentService.getAllAdjustments().subscribe(
      (response) => {
        console.log("adjustments", response);
        this.adjustments=[];
        this.adjustments=response;
        // response.forEach((x) => {
        //   x.checkbox = false;
          
        //   this.adjustments.push(x);
        // });
        this.adjustments.forEach((x) => {
          x.checkbox = false;
        });

        this.isLoader = false;
        this.dtTrigger.next();
        //this.ngAfterViewInit();
       //this.rerender()
      },
      (error) => {
        Swal.fire("Error occured while retrieving the list", "", "error");
        this.isLoader = false;
        console.log(error);
      },
    );
  }
  
  getFilteredData() {
    if (this.adjustments.length > 0) {
      this.isLoader = true;
      this.searchdata.searchString = this.searchDate;
      this.searchdata.searchString = this.searchRef;
      this.optionSelectedwarehouse = this.optionSelectedwarehouse ? this.optionSelectedwarehouse : '';
      this.warehouseService.getWarehouseByFilters(this.searchDate, this.searchRef, this.optionSelectedwarehouse).subscribe(
          (response) => {
            if (response) {
    
              //this.total = response.Total;
              this.adjustments = [];
              this.adjustments = response;
    
              this.adjustments.forEach(x => {
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
    else if (this.adjustments.length == 0) {
      this.getAllAdjustments();
    }
  }
  ResetWarehouseData() {
    this.searchDate = '';
    this.searchRef = '';
    this.optionSelectedwarehouse= '';
    this.modalService.dismissAll();
    this.getAllAdjustments();

  }
  getAllWarehouse() {
    this.warehouseService.getAllWarehouses().subscribe(
      (response) => {
        if (response) {
          this.warehouse = response;
        }
      },
      (error) => {

        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  delete(adjustment) {
    Swal.fire({
      title: "Do you want to delete the adjustment?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.adjustmentService.deleteAdjustmentById(adjustment.id).subscribe(
          (response) => {
            Swal.fire("Adjustment deleted successfully", "", "success");
            this.getAllAdjustments();
          },
          (err) => {
            Swal.fire(
              "Error occured while deleting the adjustment",
              "",
              "error",
            );
          },
        );
      } else if (result.isDenied) {
      }
    });
  }

  DeleteMultipleAdjustments() {
        Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.adjustments,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.adjustmentService.DeleteMultipleAdjustments(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllAdjustments();
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
    this.excelService.exportAsExcelFile(this.adjustments, "adjustments");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "adjustments");
  }
  onChange(evt) {
    let data, header;
    const target: DataTransfer = <DataTransfer>evt.target;
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = "";
    }
    if (this.isExcelFile) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data);
        console.log(data);
      };
    } else {
      this.inputFile.nativeElement.value = "";
    }
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
    this.adjustments.forEach((x) => {
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
    this.adjustments[i].checkbox = !this.adjustments[i].checkbox;
    var totalCount = 0
    $.each(this.adjustments,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
}

rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        // dtInstance.destroy();
        // // Call the dtTrigger to rerender again
         //this.dtTrigger.next();
    });
}
}
