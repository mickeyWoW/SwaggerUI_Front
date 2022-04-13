import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CategoryService } from "src/app/core/services/category.service";
import { ExpenseCategoriesService } from "src/app/core/services/expense-categories.service";
import { ExpenseService } from "src/app/core/services/expense.service";
import { WarehouseService } from "src/app/core/services/warehouse.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-expenses-create",
  templateUrl: "./expenses-create.component.html",
  styleUrls: ["./expenses-create.component.scss"],
})
export class ExpensesCreateComponent implements OnInit {
  today = new Date();

  form: FormGroup;
  isLoader = false;
  isSubmitted = false;
  warehouses: any;
  expenseCategories: any;
  constructor(
    private fb: FormBuilder,
    private expenseCategoryService: ExpenseCategoriesService,
    private categoryService: CategoryService,
    private warehouseService: WarehouseService,
    private expenseService: ExpenseService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllWarehouses();
    this.getAllExpenseCategories();
  }
  createForm() {
    this.form = this.fb.group({
      date: [this.today, Validators.required],
      amount: [null, Validators.required],
      expense_category_id: [null, Validators.required],
      warehouse_id: [null, Validators.required],
      details: [null, Validators.required],
    });
  }

  getAllWarehouses() {
    this.isLoader = true;
    this.warehouseService.getAllWarehouses().subscribe(
      (response) => {
        this.isLoader = false;
        console.log("warehouses", response);
        this.warehouses = response;
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllExpenseCategories() {
    this.isLoader = true;
    this.expenseCategoryService.getAllExpenseCategories().subscribe(
      (response) => {
        this.isLoader = false;
        console.log("expenseCategories", response);
        this.expenseCategories = response;
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? "0" + event.month : event.month;
    let day = event.day <= 9 ? "0" + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    console.log(finalDate);
    this.form.patchValue({ date: finalDate });
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoader = true;
    this.expenseService.createExpense(this.form.value).subscribe(
      (response) => {
        console.log("expenses", response);
        Swal.fire("Expense Created", "", "success");
        this.isLoader = false;
        this.form.reset();
        this.router.navigate(["expenses/view"]);
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured during creation", "", "error");
      },
    );
  }
  get f() {
    return this.form.controls;
  }
}
