import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "src/app/core/services/category.service";
import { ExpenseCategoriesService } from "src/app/core/services/expense-categories.service";
import { ExpenseService } from "src/app/core/services/expense.service";
import { WarehouseService } from "src/app/core/services/warehouse.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-expenses-edit",
  templateUrl: "./expenses-edit.component.html",
  styleUrls: ["./expenses-edit.component.scss"],
})
export class ExpensesEditComponent implements OnInit {
  form: FormGroup;
  isLoader = false;
  warehouses: any;
  categories: any;
  expenseId: any;
  isSubmitted = false;
  expense: any;
  expenseCategories: any;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private warehouseService: WarehouseService,
    private expenseService: ExpenseService,
    private router: Router,
    private route: ActivatedRoute,
    private expenseCategoryService: ExpenseCategoriesService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getParams();
    this.getAllWarehouses();
    this.getAllExpenseCategories();
  }
  getParams() {
    this.route.params.subscribe((params) => {
      this.expenseId = params["id"];
      this.expenseService
        .getExpenseById(this.expenseId)
        .subscribe((response) => {
          console.log(response);
          this.expense = response;
          this.form.patchValue(this.expense);
        });
    });
  }
  createForm() {
    this.form = this.fb.group({
      date: [null, Validators.required],
      amount: [null, Validators.required].toString(),
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
  update() {
    this.isLoader = true;
    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }
    this.expenseService
      .updateExpense({ ...this.form.value, id: this.expenseId }, this.expenseId)
      .subscribe(
        (response) => {
          console.log("expenses", response);
          Swal.fire("Expense Updated", "", "success");
          this.isLoader = false;
          this.form.reset();
          this.router.navigate(["expenses/view"]);
        },
        (error) => {
          this.isLoader = false;

          Swal.fire("Error occured while updating", "", "error");
        },
      );
  }
  get f() {
    return this.form.controls;
  }
}
