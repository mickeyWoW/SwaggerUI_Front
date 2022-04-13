import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CategoryService } from "src/app/core/services/category.service";
import Swal from "sweetalert2";
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";

@Component({
  selector: "app-catergory",
  templateUrl: "./catergory.component.html",
  styleUrls: ["./catergory.component.scss"],
})
export class CatergoryComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild("modal") modal: ElementRef;
  form: FormGroup;
  search = null;
  isLoader = false;
  toggle = false;
  categories: any = [];
  categoryId: any;
  isSubmitted: boolean;
  deletedCount:any=0;
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10 
    };
    this.createForm();
    this.getAllCategories();
  }
  createForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
    });
  }
  // getAllCategories() {
  //   this.categoryService.getAllCategories().subscribe(
  //     (response) => {
  //       console.log("categories", response);
  //       //this.dtTrigger.next();
  //       this.categories=[];
  //       this.rerender();
  //       response.forEach((x) => {
  //         x.checkbox = false;
  //         this.categories.push(x);
  //       });
  //       this.isLoader = false;
  //       //this.dtTrigger.next();
  //     },
  //     (err) => {
  //       console.log(err);
  //       Swal.fire("Error occured while retrieving the list", "", "error");
  //     },
  //   );
  // }
  getAllCategories() {
    this.isLoader = true;
    this.categoryService.getAllCategories().subscribe(
      (response) => {
        console.log("categories", response);
        this.isLoader = false;
        //this.rerender();
        this.dtTrigger.next();
        this.categories = [];
        response.forEach((x) => {
          x.checkbox = false;
          this.categories.push(x);
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
    if (this.form.invalid) {
      return;
    }
    this.isLoader = true;
    this.categoryService.createCategory(this.form.value).subscribe(
      (response) => {
        Swal.fire("Category Created", "", "success");
        this.isLoader = false;
        this.getAllCategories();
        this.modalService.dismissAll();
        this.form.reset();
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured during creation", "", "error");
      },
    );
  }
  update() {
    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }
    this.isLoader = true;
    this.categoryService
      .editCategoryById(
        { ...this.form.value, id: this.categoryId },
        this.categoryId,
      )
      .subscribe(
        (response) => {
          console.log("Category", response);
          Swal.fire("Category Updated", "", "success");
          this.isLoader = false;
          this.getAllCategories();
          this.form.reset();
          this.modalService.dismissAll();
        },
        (error) => {
          this.isLoader = false;

          Swal.fire("Error occured updating category", "", "error");
        },
      );
  }
  delete(category) {
    Swal.fire({
      title: "Do you want to delete the category?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.categoryService.deleteCategoryById(category.id).subscribe(
          (response) => {
            Swal.fire("Category deleted successfully", "", "success");
            this.getAllCategories();
          },
          (err) => {
            Swal.fire("Error occured while deleting the category", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }
  
  DeleteMultipleCategory() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.categories,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.categoryId.DeleteMultipleCategory(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllCategories();
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
  openEditModal(category) {
    this.categoryId = category.id;
    this.toggle = true;
    this.form.patchValue(category);
    this.modalService.open(this.modal);
  }
  get f() {
    return this.form.controls;
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
    this.categories.forEach((x) => {
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
    this.categories[i].checkbox = !this.categories[i].checkbox;
    var totalCount = 0
    $.each(this.categories,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }

  // checkAll(e) {
  //   console.log(e);
  //   this.categories.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.categories[i].checkbox = !this.categories[i].checkbox;
  // }
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
