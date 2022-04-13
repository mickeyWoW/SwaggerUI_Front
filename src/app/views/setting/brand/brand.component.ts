import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from "@angular/core";
import { Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BrandService } from "src/app/core/services/brand.service";
import Swal from "sweetalert2";
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: "app-brand",
  templateUrl: "./brand.component.html",
  styleUrls: ["./brand.component.scss"],
})
export class BrandComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild("modal") modal: ElementRef;
  form: FormGroup;
  isLoader = false;
  toggle = false;
  search = null;
  brands: any;
  brandId: any;
  isSubmitted = false;
  deletedCount:any=0;
  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllBrands();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10 
    };
  }
 
  createForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      image: [null],
    });
  }
 
  getAllBrands(): void {
    this.isLoader = true;
    this.brandService.getAllBrands().subscribe(
      (response) => {
        console.log("brands ", response);
        this.brands=[];
        this.isLoader = false;
        this.rerender();
        response.forEach((x) => {
          x.checkbox = false;
          this.brands.push(x);
        });
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
    this.brandService.createBrand(this.form.value).subscribe(
      (response) => {
        console.log("brand", response);
        Swal.fire("Brand Created", "", "success");
        this.isLoader = false;
        this.getAllBrands();
        this.modalService.dismissAll();
        this.form.reset();
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured during brand", "", "error");
      },
    );
  }
  update() {
    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }
    this.isLoader = true;
    this.brandService
      .editBrandById({ ...this.form.value, id: this.brandId }, this.brandId)
      .subscribe(
        (response) => {
          console.log("brand", response);
          Swal.fire("Brand Updated", "", "success");
          this.isLoader = false;
          this.getAllBrands();

          this.modalService.dismissAll();

          this.form.reset();
        },
        (error) => {
          this.isLoader = false;

          Swal.fire("Error occured updating brand", "", "error");
        },
      );
  }
  delete(brand) {
    Swal.fire({
      title: "Do you want to delete the brand?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.brandService.deleteBrandById(brand.id).subscribe(
          (response) => {
            Swal.fire("Brand deleted successfully", "", "success");
            this.getAllBrands();
          },
          (err) => {
            Swal.fire("Error occured while deleting the brand", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  DeleteMultipleBrand() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.brands,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.brandService.DeleteMultipleBrand(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllBrands();
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
  openEditModal(brand) {
    this.brandId = brand.id;
    this.toggle = true;
    this.form.patchValue(brand);
    this.modalService.open(this.modal);
  }
  patchImage(event) {
    console.log(event);
    console.log(event.target.files[0]);
    console.log(event);
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    console.log(file);

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      console.log(reader);
      console.log(reader);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.form.patchValue({ image: reader.result });
        console.log(this.form.value);
      };
    }
  }
  get f() {
    return this.form.controls;
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
checkAll(e) {
  console.log(e);
  if(e) {
    document.body.classList.add("checkAllbox");
  } 
  else
  {
    document.body.classList.remove("checkAllbox");
  }
  this.brands.forEach((x) => {
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
  this.brands[i].checkbox = !this.brands[i].checkbox;
  var totalCount = 0
  $.each(this.brands,function(i,obj) {
    if(obj.checkbox)
      totalCount++;
  });
  this.deletedCount=totalCount;
}
}
