import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProvidersService } from "src/app/core/services/providers.service";
import Swal from "sweetalert2";
import {ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewEncapsulation } from '@angular/core';
import { Subject } from "rxjs";
@Component({
  selector: "app-supplier-list",
  templateUrl: "./supplier-list.component.html",
  styleUrls: ["./supplier-list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SupplierListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
   @ViewChild("table") table: ElementRef;
  @ViewChild("modal") modal: ElementRef;
  @ViewChild("details") detailsModal: ElementRef;
  isLoader: boolean;
  provider: any;
  closeModal: string;
  closeResult: string = '';
  providers: any = [];
  search = null;
  supplierId: any;
  toggle: boolean = false;
  form: FormGroup;
  isSubmitted: boolean;
  deletedCount:any=0;
  constructor(
    private providersService: ProvidersService,
    private modalService: NgbModal,
    private fb: FormBuilder,
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
    this.getAllProviders();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  createForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
    });
  }
  getAllProviders() {
    this.isLoader = true;
    this.providersService.getAllProviders().subscribe(
      (response) => {
        console.log("providers ", response);
        this.providers = [];
        response.forEach((x) => {
          x.checkbox = false;
          this.providers.push(x);
        });
        this.isLoader = false;
        this.dtTrigger.next();
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  onSubmit() {
    this.isSubmitted = true;
    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
    this.isLoader = true;
    this.providersService.createProvider(this.form.value).subscribe(
      (response) => {
        this.getAllProviders();
        this.modalService.dismissAll();
        Swal.fire("Supplier created successfully", "", "success");
        this.isLoader = false;
        this.form.reset();
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while creating the supplier", "", "error");
      },
    );
  }
  update() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.providersService
      .editProvider(
        { ...this.form.value, id: this.supplierId },
        this.supplierId,
      )
      .subscribe(
        (response) => {
          this.getAllProviders();
          this.modalService.dismissAll();
          this.isLoader = false;
          this.form.reset();
          Swal.fire("Supplier updated successfully", "", "success");
        },
        (error) => {
          this.isLoader = false;
          Swal.fire("Error occured while updating the supplier", "", "error");
        },
      );
  }
  delete(supplier) {
    Swal.fire({
      title: "Do you want to delete the supplier?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.providersService.deleteProvider(supplier.id).subscribe(
          (response) => {
            Swal.fire("Supplier deleted successfully", "", "success");
            this.getAllProviders();
          },
          (err) => {
            Swal.fire("Error occured while deleting the supplier", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  DeleteMultipleSuplier() {
    Swal.fire({
  title: "Do you want to delete the product?",
  showCancelButton: true,
  confirmButtonText: "Delete",
  denyButtonText: `Cancel`,
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    var ids = [];
    $.each(this.providers,function(i,obj) {
        if(obj.checkbox)
          ids.push(obj.id);
    });
    this.isLoader = true;
    this.providersService.DeleteMultipleSuplier(ids).subscribe(
      (response) => {
        if(response)
        {
          this.getAllProviders();
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
  openEditModal(supplier) {
    console.log(supplier);
    this.supplierId = supplier.id;
    this.toggle = true;
    this.form.patchValue(supplier);
    this.modalService.open(this.modal);
  }
  get f() {
    return this.form.controls;
  }
  // checkAll(e) {
  //   console.log(e);
  //   this.providers.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.providers[i].checkbox = !this.providers[i].checkbox;
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
    this.providers.forEach((x) => {
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
    this.providers[i].checkbox = !this.providers[i].checkbox;
    var totalCount = 0
    $.each(this.providers,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }
  view(provider) {
    this.provider = provider;
    this.modalService.open(this.detailsModal);
  }

  close() {
    this.modalService.dismissAll();
  }
}
