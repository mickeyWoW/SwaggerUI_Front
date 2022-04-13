import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { WarehouseService } from "src/app/core/services/warehouse.service";
import Swal from "sweetalert2";
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";



@Component({
  selector: "app-wareshouse",
  templateUrl: "./wareshouse.component.html",
  styleUrls: ["./wareshouse.component.scss"],
})
export class WareshouseComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild("modal") modal: ElementRef;
  form: FormGroup;
  isLoader = false;
  toggle = false;
  id: any;
  warehouses: any;
  search: any = null;
  deletedCount:any=0;
  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllWarehouses();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10 
    };
  }

  createForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      mobile: [null, Validators.required],
      country: [null, Validators.required],
      city: [null, Validators.required],
      email: [null, [Validators.required, Validators.required]],
      zip: [null, Validators.required],
    });
  }
  // getAllWarehouses() {
  //   this.isLoader = true;
  //   this.warehouseService.getAllWarehouses().subscribe(
  //     (response) => {
  //       console.log("warehouses", response);
  //       this.warehouses=[];
  //       this.isLoader = false;
  //       this.rerender();
  //       this.warehouses = response;
  //       this.dtTrigger.next();
  //     },
  //     (error) => {
  //       this.isLoader = false;
  //       Swal.fire("Error occured while retrieving the list", "", "error");
  //     },
  //   );
  // }
  getAllWarehouses() {
    this.isLoader = true;
    this.warehouseService.getAllWarehouses().subscribe(
      (response) => {
        console.log("currencies", response);
        this.isLoader = false;
        this.dtTrigger.next();
        this.warehouses = [];
        response.forEach((x) => {
          x.checkbox = false;
          this.warehouses.push(x);
        });
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  onSubmit() {
    console.log(this.form.value);
    this.isLoader = true;
    if (this.form.invalid) {
      Swal.fire("Some fields are missing", "", "error");
      return;
    }
    this.warehouseService.createWarehouse(this.form.value).subscribe(
      (response) => {
        Swal.fire("Warehouse Created", "", "success");
        this.isLoader = false;
        this.getAllWarehouses();
        this.modalService.dismissAll();
        this.form.reset();
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured during warehouse", "", "error");
      },
    );
  }
  update() {
    this.isLoader = true;
    if (this.form.invalid) {
      Swal.fire("Some fields are missing", "", "error");
      return;
    }
    this.warehouseService
      .editWarehouseById({...this.form.value, id: this.id}, this.id)
      .subscribe(
        (response) => {
          console.log("currency", response);
          Swal.fire("Currency Updated", "", "success");
          this.isLoader = false;
          this.getAllWarehouses();
          this.modalService.dismissAll();
          this.form.reset();
        },
        (error) => {
          this.isLoader = false;

          Swal.fire("Error occured updating brand", "", "error");
        },
      );
  }
  delete(warehouse) {
    Swal.fire({
      title: "Do you want to delete the warehouse?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.warehouseService.deleteWarehouseById(warehouse.id).subscribe(
          (response) => {
            Swal.fire("Warehouse deleted successfully", "", "success");
            this.getAllWarehouses();
          },
          (err) => {
            Swal.fire(
              "Error occured while deleting the warehouse",
              "",
              "error",
            );
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  DeleteMultipleWareHouse() {
    Swal.fire({
      title: "Do you want to delete the w?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.warehouses,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.warehouseService.DeleteMultipleWareHouse(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllWarehouses();
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
  open() {
    this.toggle = false;
    this.modalService.open(this.modal);
  }
  openEditModal(warehouse) {
    this.id = warehouse.id;
    this.toggle = true;
    this.form.patchValue(warehouse);
    this.modalService.open(this.modal);
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
    this.warehouses.forEach((x) => {
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
    this.warehouses[i].checkbox = !this.warehouses[i].checkbox;
    var totalCount = 0
    $.each(this.warehouses,function(i,obj) {
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
