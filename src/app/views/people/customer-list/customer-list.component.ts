import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CustomerService } from "src/app/core/services/customer.service";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";
import Swal from "sweetalert2";
import {ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewEncapsulation } from '@angular/core';
import { Subject } from "rxjs";

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CustomerListComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
   @ViewChild("table") table: ElementRef;

  @ViewChild("modal") editModal: ElementRef;
  @ViewChild("modal") createModal: ElementRef;
  @ViewChild("details") detailsModal: ElementRef;
  //@ViewChild("table") table: ElementRef;
  isLoader: boolean;
  search = null;
  customer: any;
  closeModal: string;
  closeResult: string = '';
  form: FormGroup;
  toggle = true;
  isView = false;
  customerId: any;
  customerCode: number=0;
  customers: any = [];
  deletedCount:any=0;
  constructor(
    private customerService: CustomerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private pdfService: PDFService,
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
    this.getAllCustomers();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  createForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      country: [null, Validators.required],
      city: [null, Validators.required],
      phone: [null, Validators.required],
      adress: [null, Validators.required],
    });
  }
  getAllCustomers(): void {
    this.isLoader = true;
    this.customerService.getAllCustomers().subscribe(
      (response) => {
        console.log("customers ", response);
        this.customers=[];
        this.isLoader = false;
        this.dtTrigger.next();
        response.forEach((x) => {
          x.checkbox = false;
          this.customers.push(x);
        });
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  
  createCustomer() {
    console.log(this.form.value);
    if (this.form.invalid) {
      Swal.fire("Some fields were missing", "", "error");
      return;
    }
    this.isLoader = true;
    this.customerService.createCustomer(this.form.value).subscribe(
      (response) => {
        this.getAllCustomers();
        this.modalService.dismissAll();
        this.toastr.success("Customer created successfully", "", {
          timeOut: 2000,
        });
        this.isLoader = false;
        this.form.reset();
      },
      (error) => {
        this.isLoader = false;
        this.toastr.error("An error occured during creation", "", {
          timeOut: 2000,
        });
      },
    );
  }
  updateCustomer() {
    this.customerService
      .updateCustomer(
        { ...this.form.value, id: this.customerId, code: this.customerCode },this.customerId)
      .subscribe(
        (response) => {
          this.getAllCustomers();
          this.modalService.dismissAll();
          Swal.fire("Customer updated successfully", "", "success");
          this.isLoader = false;
          this.form.reset();
        },
        (error) => {
          this.isLoader = false;
          this.toastr.error("An error occured during updation", "", {
            timeOut: 2000,
          });
        },
      );
  }
  delete(customer) {
    Swal.fire({
      title: "Do you want to delete the customer?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.customerService.deleteCustomerById(customer.id).subscribe(
          (response) => {
            Swal.fire("Customer deleted successfully", "", "success");
            this.getAllCustomers();
          },
          (err) => {
            Swal.fire("Error occured while deleting the customer", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  DeleteMultipleUser() {
    Swal.fire({
  title: "Do you want to delete the product?",
  showCancelButton: true,
  confirmButtonText: "Delete",
  denyButtonText: `Cancel`,
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    var ids = [];
    $.each(this.customers,function(i,obj) {
        if(obj.checkbox)
          ids.push(obj.id);
    });
    this.isLoader = true;
    this.customerService.DeleteMultipleUser(ids).subscribe(
      (response) => {
        if(response)
        {
          this.getAllCustomers();
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
  edit(customer) {
    this.isView = false;
    this.customerId = customer.id;
    this.customerCode = customer.code;
    this.form.patchValue(customer);
    this.toggle = false;
    this.modalService.open(this.editModal);
  }

  view(customer) {
    this.customer = customer;
    this.modalService.open(this.detailsModal);
  }
  closs() {
    this.modalService.dismissAll();
  }
  printExcel() {
    this.excelService.exportAsExcelFile(this.customers, "customers");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "expenses");
  }
  // checkAll(e) {
  //   console.log(e);
  //   this.customers.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.customers[i].checkbox = !this.customers[i].checkbox;
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
    this.customers.forEach((x) => {
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
    this.customers[i].checkbox = !this.customers[i].checkbox;
    var totalCount = 0
    $.each(this.customers,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }
}
