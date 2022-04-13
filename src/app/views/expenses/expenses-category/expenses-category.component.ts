import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ExpenseCategoriesService } from "src/app/core/services/expense-categories.service";
import Swal from "sweetalert2";
import { Subject } from "rxjs";

@Component({
  selector: "app-expenses-category",
  templateUrl: "./expenses-category.component.html",
  styleUrls: ["./expenses-category.component.scss"],
})
export class ExpensesCategoryComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild("modal") modal: ElementRef;
  form: FormGroup;
  isSubmitted = false;
  toggle = false;
  isLoader: boolean;
  expenseCategories: any=[];
  expenseCategoryId: any;
  search: any;
  deletedCount:any=0;

  constructor(
    private fb: FormBuilder,
    private expenseCategoriesService: ExpenseCategoriesService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    this.getAllExpenseCategories();
    this.createForm();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  createForm() {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      description: [""],
    });
  }

  getAllExpenseCategories() {
    this.isLoader = true;
    this.expenseCategoriesService.getAllExpenseCategories().subscribe(
      (response) => {
        console.log("expenseCategories", response);
        this.expenseCategories=[];
        this.isLoader = false;
        this.dtTrigger.next();
        // this.expenseCategories = response;
        response.forEach((x) => {
          x.checkbox = false;
          this.expenseCategories.push(x);
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
      this.toastr.error("Please fill all the required fields");
      return;
    }
    this.isLoader = true;
    this.expenseCategoriesService
      .createExpenseCategory(this.form.value)
      .subscribe(
        (response) => {
          this.isLoader = false;
          Swal.fire("Expense category created successfully", "", "success");

          this.getAllExpenseCategories();
          this.modalService.dismissAll();
        },
        (err) => {
          this.isLoader = false;
          Swal.fire(
            "Error occured while creating expense category",
            "",
            "error",
          );
        },
      );
  }
  delete(expenseCategory) {
    Swal.fire({
      title: "Do you want to delete the expense category?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.expenseCategoriesService
          .deleteExpenseCategoryById(expenseCategory.id)
          .subscribe(
            (response) => {
              Swal.fire("Expense Category deleted successfully", "", "success");
              this.getAllExpenseCategories();
            },
            (err) => {
              Swal.fire(
                "Error occured while deleting the expense",
                "",
                "error",
              );
            },
          );
      } else if (result.isDenied) {
      }
    });
  }

  DeleteMultipleExpenseCategory() {
    debugger;
    Swal.fire({
  title: "Do you want to delete the product?",
  showCancelButton: true,
  confirmButtonText: "Delete",
  denyButtonText: `Cancel`,
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    var ids = [];
    $.each(this.expenseCategories,function(i,obj) {
        if(obj.checkbox)
          ids.push(obj.id);
    });
    this.isLoader = true;
    this.expenseCategoriesService.DeleteMultipleExpenseCategory(ids).subscribe(
      (response) => {
        if(response)
        {
          this.getAllExpenseCategories();
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
  openEditModal(expenseCategory) {
    this.expenseCategoryId = expenseCategory.id;
    this.toggle = true;
    this.form.patchValue(expenseCategory);
    this.modalService.open(this.modal);
  }
  open() {
    this.modalService.open(this.modal);
  }
  get f() {
    return this.form.controls;
  }

  // checkAll(e) {
  //   console.log(e);
  //   this.expenseCategories.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.expenseCategories[i].checkbox = !this.expenseCategories[i].checkbox;
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
    this.expenseCategories.forEach((x) => {
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
    this.expenseCategories[i].checkbox = !this.expenseCategories[i].checkbox;
    var totalCount = 0
    $.each(this.expenseCategories,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }
}
