import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ExcelService } from "src/app/core/services/excel.service";
import { ExpenseService } from "src/app/core/services/expense.service";
import { PDFService } from "src/app/core/services/pdf.service";
import {ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";
import Swal from "sweetalert2";
import { ViewEncapsulation } from '@angular/core';
import { Subject } from "rxjs";
import { WarehouseService } from "../../../core/services/warehouse.service";
import{ExpenseCategoriesService}from '../../../core/services/expense-categories.service';
import {ExpenceModel  } from '../expenceModel';
@Component({
  selector: "app-expenses-list",
  templateUrl: "./expenses-list.component.html",
  styleUrls: ["./expenses-list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ExpensesListComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild("table") table: ElementRef;
  isLoader = false;
  expenses: any = [];
  search: any;
  closeModal: string;
  closeResult: string = '';
  deletedCount: any = 0;
  warehouseData:any=[];
  expenceCategoryData=[];
  searchdata: ExpenceModel={} as any;
    date:string;
    reference:string;
    optionSelectedwarehouse:any;
    expenseCategory:any;
 
  constructor(
    private expenseService: ExpenseService,
    private excelService: ExcelService,
    private pdfService: PDFService,
    private modalService: NgbModal,
    private warehouseService:WarehouseService,
    private expenseCategoriesService:ExpenseCategoriesService,
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
    this.getAllExpenses();
    this.getAllWarehouse();
    this.getAllExpenceCategory();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  getAllExpenses() {
    this.isLoader = true;
    this.expenseService.getAllExpenses().subscribe(
      (response) => {
        console.log("warehouses", response);
        this.expenses=[];
        this.isLoader = false;
        this.dtTrigger.next();
        response.forEach((x) => {
          x.checkbox = false;
          this.expenses.push(x);
        });
        // this.expenses = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllWarehouse() {
    this.warehouseService.getAllWarehouses().subscribe(
      (response) => {
        if (response) {
          this.warehouseData = response;
        }
      },
      (error) => {

        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getFilteredData() {
    if (this.expenses.length > 0) {
      this.isLoader = true;
      this.searchdata.searchString=this.date;
      this.searchdata.searchString = this.reference;
      this.searchdata = this.optionSelectedwarehouse ? this.optionSelectedwarehouse : '';
      this.searchdata = this.expenseCategory ? this.expenseCategory : '';
        this.expenseService.GetFilterExpense(this.date, this.reference, this.optionSelectedwarehouse, this.expenseCategory).subscribe(
          (response) => {
            if (response) {
    
              //this.total = response.Total;
              this.expenses = [];
              this.expenses = response;
    
              this.expenses.forEach(x => {
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
    else if (this.expenses.length == 0) {
      this.getAllExpenses();
    }
  }
  ResetExpenceData() {
    this.date = '';
    this.reference = '';
    this.expenseCategory='';
    this.optionSelectedwarehouse= '';
    this.modalService.dismissAll();
    this.getAllExpenses();

  }
  getAllExpenceCategory() {
    this.expenseCategoriesService.getAllExpenseCategories().subscribe(
      (response) => {
        if (response) {
          this.expenceCategoryData = response;
        }
      },
      (error) => {

        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  delete(expense) {
    Swal.fire({
      title: "Do you want to delete the expense?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.expenseService.deleteExpenseById(expense.id).subscribe(
          (response) => {
            Swal.fire("Expense deleted successfully", "", "success");
            this.getAllExpenses();
          },
          (err) => {
            Swal.fire("Error occured while deleting the expense", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  
  DeleteMultipleExpense() {
    Swal.fire({
  title: "Do you want to delete the product?",
  showCancelButton: true,
  confirmButtonText: "Delete",
  denyButtonText: `Cancel`,
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    var ids = [];
    $.each(this.expenses,function(i,obj) {
        if(obj.checkbox)
          ids.push(obj.id);
    });
    this.isLoader = true;
    this.expenseService.DeleteMultipleExpense(ids).subscribe(
      (response) => {
        if(response)
        {
          this.getAllExpenses();
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
    this.excelService.exportAsExcelFile(this.expenses, "expenses");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "expenses");
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
    this.expenses.forEach((x) => {
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
    this.expenses[i].checkbox = !this.expenses[i].checkbox;
    var totalCount = 0
    $.each(this.expenses,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }

}
