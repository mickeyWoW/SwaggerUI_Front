import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UnitService } from "src/app/core/services/unit.service";
import Swal from "sweetalert2";
import { Subject } from "rxjs";
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: "app-unit",
  templateUrl: "./unit.component.html",
  styleUrls: ["./unit.component.scss"],
})
export class UnitComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild("modal") modal: ElementRef;
  search = null;
  form: FormGroup;
  isLoader = false;
  currencies: any;
  toggle = false;
  currencyId: any;
  units: any;
  unitId: any;
  isSubmitted: boolean;
  deletedCount:any=0;
  operators = [
    { name: "Multiply(*)", value: "*" },
    { name: "Divide(/)", value: "/" },
  ];
  base_unit = [
    { id: 1, name: "Piece" },
    { id: 2, name: "Meter" },
    { id: 3, name: "Kilogram" },
  ];
  constructor(
    private fb: FormBuilder,
    private unitService: UnitService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10 
    };
    this.createForm();
    this.getAllUnits();
  }
  createForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      ShortName: [null, Validators.required],
      base_unit: [null],
      Operator: ["Multiply(*)"],
      operator_value: [1],
    });
  }
  getAllUnits() {
    this.isLoader = true;
    this.unitService.getAllUnits().subscribe(
      (response) => {
        console.log("units", response);
        this.units=[];
        response.forEach((x) => {
          x.checkbox = false;
          this.units.push(x);
        });
        this.isLoader = false;
        this.rerender();
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  onSubmit() {
    console.log(this.form.value);
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoader = true;
    this.unitService.createUnit(this.form.value).subscribe(
      (response) => {
        console.log("unit", response);
        Swal.fire("Unit Created", "", "success");
        this.getAllUnits();
        this.isLoader = false;
        this.modalService.dismissAll();
        this.form.reset();
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured while creating unit", "", "error");
      },
    );
  }
  update() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoader = true;
    this.unitService
      .editUnitById({ ...this.form.value, id: this.unitId }, this.unitId)
      .subscribe(
        (response) => {
          console.log("unit", response);
          Swal.fire("Unit Updated", "", "success");
          this.isLoader = false;
          this.getAllUnits();
          this.form.reset();
          this.modalService.dismissAll();
        },
        (error) => {
          this.isLoader = false;

          Swal.fire("Error occured updating unit", "", "error");
        },
      );
  }
  delete(unit) {
    Swal.fire({
      title: "Do you want to delete the unit?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.unitService.deleteUnitById(unit.id).subscribe(
          (response) => {
            Swal.fire("Unit deleted successfully", "", "success");
            this.getAllUnits();
          },
          (err) => {
            Swal.fire("Error occured while deleting the unit", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  DeleteMultipleUnit() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.units,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.unitService.DeleteMultipleUnit(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllUnits();
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
  openEditModal(unit) {
    console.log(unit);
    this.unitId = unit.id;
    this.toggle = true;
    this.form.patchValue(unit);
    this.modalService.open(this.modal);
  }
  get f() {
    return this.form.controls;
  }

  // checkAll(e) {
  //   console.log(e);
  //   this.units.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.units[i].checkbox = !this.units[i].checkbox;
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
    this.units.forEach((x) => {
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
    this.units[i].checkbox = !this.units[i].checkbox;
    var totalCount = 0
    $.each(this.units,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }

  getBaseUnit(id)
  {
  var u=  this.units.find(s => s.id==id);
  return u != null ? u.name : "";
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
}

rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
    });
}
}
