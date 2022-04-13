import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CategoryService } from "src/app/core/services/category.service";
import { CustomerService } from "src/app/core/services/customer.service";
import { ProductService } from "src/app/core/services/product.service";
import { SalesService } from "src/app/core/services/sales.service";
import { WarehouseService } from "src/app/core/services/warehouse.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-pos",
  templateUrl: "./pos.component.html",
  styleUrls: ["./pos.component.scss"],
})
export class PosComponent implements OnInit {
  isLoader: boolean;
  isSubmitted: boolean;
  products: any = [
    {
      id: "61b1cc51c03ba126ea81f8d2",
      code: "string",
      Type_barcode: "string",
      name: "string",
      cost: 0,
      price: 12,
      category_id: "787878787878787878787878",
      brand_id: "787878787878787878787878",
      unit_id: "787878787878787878787878",
      unit_sale_id: "787878787878787878787878",
      unit_purchase_id: "787878787878787878787878",
      TaxNet: 0,
      tax_method: "string",
      image: "string",
      note: "string",
      stock_alert: 5,
      is_variant: "string",
      is_active: "string",
      created_at: null,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: "61b1cc51c03ba126ea9  1f8d2",
      code: "string",
      Type_barcode: "string",
      name: "string",
      cost: 0,
      price: 10,
      category_id: "787878787878787878787878",
      brand_id: "787878787878787878787878",
      unit_id: "787878787878787878787878",
      unit_sale_id: "787878787878787878787878",
      unit_purchase_id: "787878787878787878787878",
      TaxNet: 0,
      tax_method: "string",
      image: "string",
      note: "string",
      stock_alert: 10,
      is_variant: "string",
      is_active: "string",
      created_at: null,
      updated_at: null,
      deleted_at: null,
    },
  ];
  warehouses: any = [];
  customers: any = [];
  form: FormGroup;
  search = null;
  categories: any;
  selectedProducts: any = [];
  grandTotal: any = 0;
  subTotal: any = 0;
  constructor(
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private customerService: CustomerService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private salesService: SalesService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllProducts();
    this.getAllWarehouses();
    this.getAllCustomers();
    this.getAllCategories();
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
      grandTotal: [null],
      payment_status: [null],

      products: [],
    });
  }
  getAllProducts() {
    this.isLoader = true;
    this.productService.getAllProducts().subscribe(
      (response) => {
        console.log("Products", response);

        console.log(this.products);
        // this.products = response;

        this.isLoader = false;
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
  getAllCustomers(): void {
    this.isLoader = true;
    this.customerService.getAllCustomers().subscribe(
      (response) => {
        console.log("customers ", response);
        this.isLoader = false;
        this.customers = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(
      (response) => {
        console.log("categories", response);
        this.categories = response;
      },
      (err) => {
        console.log(err);
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  onSearchedItemClicked(i) {
    const product = this.products[i];
    console.log(product);
    product.dummyQuantity = 0;

    // product.price = 10;
    this.subTotal = product.dummyQuantity * product.price;
    if (this.selectedProducts.length === 0) {
      this.selectedProducts.push(product);

      console.log(this.selectedProducts);
      return;
    }
    const length = this.selectedProducts.filter(
      (item) => item.id === product.id,
    ).length;
    if (length > 0) {
      this.toastr.error("Product already added", "", {
        timeOut: 2000,
      });
    } else {
      this.selectedProducts.push(product);
    }

    console.log(this.selectedProducts);
  }
  increment(product, i) {
    console.log(product, i);
    console.log(this.selectedProducts);
    this.selectedProducts[i].dummyQuantity =
      +this.selectedProducts[i].dummyQuantity + 1;
    console.log("GranTotal", this.grandTotal);
    console.log("Cost", product.cost);
    console.log("Tax", product.TaxNet);
    this.subTotal = this.subTotal + this.selectedProducts[i].price;
    this.grandTotal = +this.subTotal;
    this.form.patchValue({ grandTotal: this.grandTotal });

    // console.log(this.grandTotal);
    // this.form.patchValue({ grandTotal: this.grandTotal });
    // this.products[i].dummyQuantity = +this.products[i].dummyQuantity + 1;
    // // this.patchForm(this.selectedProducts[i], i);
    // this.form.patchValue({ product_id: product.id });
    // this.form.patchValue({ product_variant: product.is_variant });
    // this.form.patchValue({ quantity: +this.products[i].dummyQuantity });
    // this.form.patchValue({ type: this.products[i].dummyType });
  }
  manualIncrement(quantity, i) {
    if (quantity > this.selectedProducts[i].stock_alert) {
      Swal.fire("Quantity cannot be greater than stock alert", "", "error");
      this.selectedProducts.dummyQuantity = +this.selectedProducts.stock_alert;
      return;
    }
    let total =
      this.selectedProducts[i].dummyQuantity *
      (this.selectedProducts[i].cost + this.selectedProducts[i].TaxNet);
    this.selectedProducts[i].dummyQuantity = +quantity;
    this.grandTotal = this.grandTotal - total;
    total =
      (this.selectedProducts[i].cost + this.selectedProducts[i].TaxNet) *
      this.selectedProducts[i].dummyQuantity;

    this.grandTotal = this.grandTotal + total;
    this.form.patchValue({ grandTotal: this.grandTotal });
  }
  decrement(product, i) {
    console.log(this.selectedProducts[i].dummyQuantity);

    this.selectedProducts[i].dummyQuantity =
      +this.selectedProducts[i].dummyQuantity - 1;
    this.subTotal = this.subTotal + this.selectedProducts[i].price;
    this.grandTotal = +this.subTotal;
    // console.log(product);
    // this.products[i].dummyQuantity = +this.products[i].dummyQuantity + 1;
    this.form.patchValue({ grandTotal: this.grandTotal });
    // this.form.patchValue({ product_id: product.id });
    // this.form.patchValue({ product_variant: product.is_variant });
    // this.form.patchValue({ quantity: product.dummyQuantity });
    // this.form.patchValue({ type: product.dummyType });
  }
  get f() {
    return this.form.controls;
  }
  spliceProduct(i) {
    console.log(this.selectedProducts[i]);
    console.log(this.selectedProducts[i].dummyQuantity);
    console.log(this.selectedProducts[i].cost);
    const total =
      this.selectedProducts[i].dummyQuantity * this.selectedProducts[i].price;
    this.grandTotal = this.grandTotal - total;
    this.form.patchValue({ grandTotal: this.grandTotal });

    console.log(this.grandTotal);
    this.selectedProducts.splice(i, 1);
    if (this.selectedProducts.length === 0) {
      this.grandTotal = 0;
      this.form.patchValue({ grandTotal: this.grandTotal });
    }
  }
  onSubmit() {
    this.form.patchValue({ products: JSON.stringify(this.selectedProducts) });
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoader = true;
    this.salesService.createSale(this.form.value).subscribe(
      (response) => {
        console.log("purchase", response);
        Swal.fire("Created", "", "success");
        this.isLoader = false;
        this.grandTotal = 0;
        this.selectedProducts = [];

        this.subTotal = 0;

        this.form.reset();
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured during creation", "", "error");
      },
    );
  }
}
