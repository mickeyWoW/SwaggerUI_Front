import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { STATUS } from "src/app/@constants/status";
import { TYPES } from "src/app/@constants/types";
import { CustomerService } from "src/app/core/services/customer.service";
import { ProductService } from "src/app/core/services/product.service";
import { QuotationService } from "src/app/core/services/quotation.service";
import { WarehouseService } from "src/app/core/services/warehouse.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-quotation-edit",
  templateUrl: "./quotation-edit.component.html",
  styleUrls: ["./quotation-edit.component.scss"],
})
export class QuotationEditComponent implements OnInit {
  options: string[] = ["Pending", "Completed"];
  form: FormGroup;
  isLoader = false;
  users: any;
  warehouses: any;
  productControl = new FormControl();
  isSubmitted = false;
  filteredOptions: Observable<string[]>;
  products: any = [];

  search = null;

  categories: any;
  orderTax: any = 0;
  subTotal: any = 0;
  grandTotal: number = 0;
  isValueIsAboveZero = true;
  id: any = null;

  searchedProducts: any = [];
  types = TYPES;
  status = STATUS;
  quotationID: any;
  date: any;
  customers: any;
  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private quotationService: QuotationService,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getParams();
    this.getAllCustomers();
    this.getAllWarehouses();
    this.filteredOptions = this.productControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value)),
    );
  }
  createForm(): void {
    this.form = this.fb.group({
      warehouse_id: [null, Validators.required],
      client_id: [null, Validators.required],
      taxNet: [null],
      shipping: [null],
      discount: [null],
      date: [null],
      notes: [null],
      statut: [null],
      products: [null],
      grandTotal: [null],
    });
  }
  getParams() {
    this.route.params.subscribe((param) => {
      this.quotationID = param["id"];
      this.quotationService
        .getQuotationById(this.quotationID)
        .subscribe((response) => {
          console.log(response);
          this.form.patchValue({
            client_id: response.data.client_id,
            warehouse_id: response.data.warehouse_id,
            grandTotal: response.data.GrandTotal,
            discount: response.data.discount,
            taxNet: response.data.TaxNet,
            shipping: response.data.shipping,
            notes: response.data.notes,
            statut: response.data.statut,
          });
          this.date = response.data.date;
          this.grandTotal = response.data.GrandTotal;

          this.form.patchValue({ date: response.data.date });
          this.searchedProducts = [];
          this.searchedProducts = JSON.parse(response.data.products);
          console.log(this.searchedProducts);
        });
    });
  }
  getAllCustomers() {
    this.isLoader = true;
    this.customerService.getAllCustomers().subscribe(
      (response) => {
        console.log("customers", response);
        this.isLoader = false;
        this.customers = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
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

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? "0" + event.month : event.month;
    let day = event.day <= 9 ? "0" + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    console.log(finalDate);
    this.form.patchValue({ date: finalDate });
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
  nullifySearch() {
    this.products = [];
    this.productControl.setValue(null);
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

  increment(product, i) {
    this.searchedProducts[i].dummyQuantity =
      +this.searchedProducts[i].dummyQuantity + 1;
    console.log("GranTotal", this.grandTotal);
    console.log("Cost", product.cost);
    console.log("Tax", product.TaxNet);

    this.grandTotal = +this.grandTotal + +product.cost + product.TaxNet;
    this.subTotal = +this.subTotal + +product.cost + product.TaxNet;
    console.log(this.grandTotal);
    this.form.patchValue({ grandTotal: this.grandTotal });

    // this.products[i].dummyQuantity = +this.products[i].dummyQuantity + 1;
    // this.patchForm(this.searchedProducts[i], i);

    // this.form.patchValue({ product_id: product.id});
    // this.form.patchValue({ product_variant: product.is_variant });
    // this.form.patchValue({ quantity: +this.products[i].dummyQuantity });
    // this.form.patchValue({ type: this.products[i].dummyType });
  }
  manualIncrement(quantity, i) {
    if (quantity > this.searchedProducts[i].stock_alert) {
      Swal.fire("Quantity cannot be greater than stock alert", "", "error");
      this.searchedProducts.dummyQuantity = +this.searchedProducts.stock_alert;
      return;
    }
    let total =
      this.searchedProducts[i].dummyQuantity *
      (this.searchedProducts[i].cost + this.searchedProducts[i].TaxNet);
    this.searchedProducts[i].dummyQuantity = +quantity;
    this.grandTotal = this.grandTotal - total;
    total =
      (this.searchedProducts[i].cost + this.searchedProducts[i].TaxNet) *
      this.searchedProducts[i].dummyQuantity;

    this.grandTotal = this.grandTotal + total;
    this.form.patchValue({ grandTotal: this.grandTotal });
  }
  decrement(product, i) {
    this.searchedProducts[i].dummyQuantity =
      +this.searchedProducts[i].dummyQuantity - 1;
    this.grandTotal = +this.grandTotal - +product.cost - product.TaxNet;
    this.subTotal = +this.subTotal - +product.cost - product.TaxNet;
    // console.log(product);
    // this.products[i].dummyQuantity = +this.products[i].dummyQuantity + 1;
    this.form.patchValue({ grandTotal: this.grandTotal });
    // this.form.patchValue({ product_id: product.id });
    // this.form.patchValue({ product_variant: product.is_variant });
    // this.form.patchValue({ quantity: product.dummyQuantity });
    // this.form.patchValue({ type: product.dummyType });
  }
  onSubmit() {
    this.isSubmitted = true;
    this.form.patchValue({ products: JSON.stringify(this.searchedProducts) });
    if (this.form.invalid) {
      return;
    }
    this.isLoader = true;
    this.quotationService
      .editQuotation(
        { ...this.form.value, id: this.quotationID },
        this.quotationID,
      )
      .subscribe(
        (response) => {
          console.log("Quotation", response);
          Swal.fire("Quotation Updated", "", "success");
          this.router.navigate(["quotation/view"]);
          this.isLoader = false;
          this.form.reset();
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
  spliceProduct(i) {
    console.log(this.searchedProducts[i]);
    console.log(this.searchedProducts[i].dummyQuantity);
    console.log(this.searchedProducts[i].cost);
    const total =
      this.searchedProducts[i].dummyQuantity * this.searchedProducts[i].cost;
    this.grandTotal = this.grandTotal - total;
    this.form.patchValue({ grandTotal: this.grandTotal });

    console.log(this.grandTotal);
    this.searchedProducts.splice(i, 1);
    console.log(this.searchedProducts);
    if (this.searchedProducts.length === 0) {
      this.grandTotal = 0;
      this.form.patchValue({ grandTotal: this.grandTotal });
    }
  }
}
