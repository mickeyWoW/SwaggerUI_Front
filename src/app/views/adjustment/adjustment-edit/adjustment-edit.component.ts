import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { TYPES } from "src/app/@constants/types";
import { AdjustmentService } from "src/app/core/services/adjustment.service";
import { ProductService } from "src/app/core/services/product.service";
import { WarehouseService } from "src/app/core/services/warehouse.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-adjustment-edit",
  templateUrl: "./adjustment-edit.component.html",
  styleUrls: ["./adjustment-edit.component.scss"],
})
export class AdjustmentEditComponent implements OnInit {
  @ViewChild("qty") qty: ElementRef;
  @ViewChild("productTable") productTable: ElementRef;
  today = new Date();
  isSubmitted = false;
  productControl = new FormControl();
  filteredOptions: Observable<string[]>;
  form: FormGroup;
  adjustment_detail: FormArray;
  warehouses: any;
  isLoader = false;
  search = null;
  products: any = [];
  types = TYPES;
  type = null;
  searchedProducts: any = [];
  adjustmentId: any;
  date: any;
  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private adjustmentService: AdjustmentService,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllWarehouses();
    this.filteredOptions = this.productControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value)),
    );
    this.getParams();
  }

  createForm() {
    this.form = this.fb.group({
      date: [null, Validators.required],
      warehouse_id: [null, Validators.required],
      notes: [null],
      items: [0],
      adjustment_detail: [["null"]],
      products: [null],
    });
  }
  getParams() {
    this.route.params.subscribe((params) => {
      this.adjustmentId = params["id"];
      this.adjustmentService
        .getAdjustmentById(this.adjustmentId)
        .subscribe((response) => {
          console.log(response);
          console.log(JSON.parse(response.data.products));
          this.form.patchValue({
            warehouse_id: response.data.warehouse_id,
            notes: response.data.notes,
          });
          this.date = response.data.date;

          this.form.patchValue({ date: response.data.date });
          this.searchedProducts.push(...JSON.parse(response.data.products));

          console.log(this.searchedProducts);
          // this.searchedProduct = response.data.adjustmentDetail[0];
        });
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
  getProductsByFilter(e) {
    console.log(e);
    //removes leading and trailing white spaces
    const value = e.trim();
    // checks if the entire string is blank space
    if (!value.replace(/\s/g, "").length) {
      console.log(
        "string only contains whitespace (ie. spaces, tabs or line breaks)",
      );
      this.products = [];
      this.productControl.setValue(null);
      return;
    }
    console.log(this.f.warehouse_id.value);
    if (this.f.warehouse_id.value === null) {
      this.toastr.error("Please select warehouse", "", {
        timeOut: 3000,
      });
      this.products = [];
      this.productControl.setValue(null);
      return;
    }
    this.isLoader = true;
    if (value) {
      this.productService.getProductsByFilter(e).subscribe(
        (response) => {
          console.log("Products", response);

          this.products = response;
          console.log(this.products);
          this.isLoader = false;
        },
        (error) => {
          this.isLoader = false;
          Swal.fire("Error occured while retrieving the list", "", "error");
        },
      );
    }
  }
  onSearchedItemClicked(product) {
    console.log(product);
    product.dummyQuantity = 0;
    product.dummyType = "Addition";
    if (this.searchedProducts.length === 0) {
      this.searchedProducts.push(product);
      console.log(this.searchedProducts);
      this.nullifySearch();
      return;
    }
    const length = this.searchedProducts.filter(
      (item) => item.id === product.id,
    ).length;
    if (length > 0) {
      this.toastr.error("Product already added", "", {
        timeOut: 2000,
      });
      this.nullifySearch();
    } else {
      this.searchedProducts.push(product);
      this.nullifySearch();
    }

    console.log(this.searchedProducts);
  }
  nullifySearch() {
    this.products = [];
    this.productControl.setValue(null);
  }
  onTypeChange(e, i) {
    console.log(e);
    this.searchedProducts[i].dummyType = e.name;
  }

  increment(i) {
    this.searchedProducts[i].dummyQuantity =
      +this.searchedProducts[i].dummyQuantity + 1;
    // console.log(product);
    // this.products[i].dummyQuantity = +this.products[i].dummyQuantity + 1;

    // this.form.patchValue({ product_id: product.id});
    // this.form.patchValue({ product_variant: product.is_variant });
    // this.form.patchValue({ quantity: +this.products[i].dummyQuantity });
    // this.form.patchValue({ type: this.products[i].dummyType });
  }
  manualIncrement(quantity, i) {
    if (quantity > this.searchedProducts[i].stock_alert) {
      Swal.fire("Quantity cannot be greater than stock alert", "", "error");
      this.searchedProducts[i].dummyQuantity =
        +this.searchedProducts[i].stock_alert;
      return;
    }
    this.searchedProducts[i].dummyQuantity = +quantity;
  }
  decrement(i) {
    this.searchedProducts[i].dummyQuantity =
      +this.searchedProducts[i].dummyQuantity - 1;

    // this.form.patchValue({ product_id: product.id });
    // this.form.patchValue({ product_variant: product.is_variant });
    // this.form.patchValue({ quantity: product.dummyQuantity });
    // this.form.patchValue({ type: product.dummyType });
  }

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? "0" + event.month : event.month;
    let day = event.day <= 9 ? "0" + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    console.log(finalDate);
    this.today = new Date(finalDate);
    this.form.patchValue({ date: finalDate });
  }
  // patchForm(product) {
  //   console.log("value to be patched", product);
  //   const adjustmentDetails = [
  //     {
  //       product_id: product.id,
  //       product_variant: product.is_variant,
  //       quantity: product.dummyQuantity,
  //     },
  //   ];
  //   console.log(adjustmentDetails);
  //   // this.adjustmentDetails.patchValue({
  //   //   product_id: product.id,
  //   //   product_variant: product.is_variant,
  //   //   quantity: product.dummyQuantity,
  //   // });
  //   // this.adjustmentDetails.patchValue(product);
  //   this.form.patchValue({
  //     product_id: this.searchedProducts.id,
  //     adjustment_id: this.searchedProducts.is_variant,
  //     quantity: this.searchedProducts.dummyQuantity,
  //     type: this.searchedProducts.dummyType,
  //     product_variant: this.searchedProducts.is_variant,
  //     adjustment_detail: adjustmentDetails,
  //   });
  //   this.form.patchValue({ items: this.searchedProducts.dummyQuantity });
  //   console.log(this.form.value);
  // }
  onSubmit() {
    this.isSubmitted = true;
    console.log(this.searchedProducts);

    this.form.patchValue({
      products: JSON.stringify(this.searchedProducts),
    });

    if (this.form.invalid) {
      console.log("insde");
      return;
    }
    this.isLoader = true;
    this.adjustmentService
      .editAdjustmentById(
        { ...this.form.value, id: this.adjustmentId },
        this.adjustmentId,
      )
      .subscribe(
        (response) => {
          console.log("adjustments", response);
          Swal.fire("Adjustment Updated", "", "success");
          this.isLoader = false;
          this.form.reset();
          this.products = null;
          this.search = null;
          this.router.navigate(["/adjustment/view"]);
        },
        (error) => {
          this.isLoader = false;
          Swal.fire("Error occured during updation", "", "error");
        },
      );
  }
  get f() {
    return this.form.controls;
  }
  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.products.filter((option) =>
      option.toLowerCase().includes(filterValue),
    );
  }
}
