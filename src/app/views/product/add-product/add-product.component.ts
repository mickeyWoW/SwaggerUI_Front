import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { BARCODE_SYMBOLOGY } from "src/app/@constants/barcode_symbology";
import { TAX_TYPES } from "src/app/@constants/tax_method";
import { BrandService } from "src/app/core/services/brand.service";
import { CategoryService } from "src/app/core/services/category.service";
import { PaymentPurchaseService } from "src/app/core/services/PaymentPurchase.service";
import { SalesService } from "src/app/core/services/sales.service";
import { UnitService } from "src/app/core/services/unit.service";
import Swal from "sweetalert2";
import { DomSanitizer } from '@angular/platform-browser';
import { ProductService } from "../../../core/services/product.service";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  isLoader = false;
  isSubmitted = false;
  //Arrays from constants
  barcode_sybmology = BARCODE_SYMBOLOGY;
  taxTypes = TAX_TYPES;
  // Arrays
  categories: any;
  brands: any;
  sales: any;
  paymentPurchase: any;
  units: any;

  APIURL = 'https://evening-anchorage-3159.herokuapp.com/api/';
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  localImageUrl: any;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private salesService: SalesService,
    private unitService: UnitService,
    private paymentPurchaseService: PaymentPurchaseService,
    private router: Router,
    public sanitizer: DomSanitizer
  ) {

    this.uploader = new FileUploader({
      url: this.APIURL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async item => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });

    this.uploader.onAfterAddingFile = (fileItem) => {
      console.log(this.uploader.queue);
      this.uploader.queue.forEach((item: any) => {
        item._file.isMain = false;
      })
      console.log(this.uploader.queue);

    }

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe(res => this.response = res);

  }

  getImage(fileItem: any) {
    let url = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  checkChange(item: any, event: any) {
    this.uploader.queue.forEach((item: any, index: any) => {
      item._file.isMain = false;
    })
    item._file.isMain = event.target.checked;

  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  ngOnInit(): void {
    this.createForm();
    this.getCategories();
    this.getBrands();
    this.getSales();
    this.getPaymentPurchases();
    this.getUnits();
  }
  createForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
      type_barcode: [null, Validators.required],
      category_id: [null, Validators.required],
      brand_id: [null],
      cost: [null, Validators.required],
      price: [null, Validators.required],
      unit_id: [null, Validators.required],
      unit_sale_id: [null, Validators.required],
      unit_purchase_id: [null, Validators.required],
      stock_alert: [null],
      taxNet: [null],
      tax_method: [null, Validators.required],
      note: [null],
    });
  }

  patchImage(event): Promise<any> {
    console.log(event);
    console.log(event._file);
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event._file;
    console.log(file);

    reader.readAsDataURL(event._file);
    console.log(reader);
    console.log(reader.result);
    // When file uploads set it to file formcontrol
    return new Promise(resolve => {
      reader.onload = () => {
        resolve(reader.result);
      }
    })
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(
      (response) => {
        console.log("categories", response);
        this.categories = response;
      },
      (err) => {
        console.log(err);
      },
    );
  }
  getBrands() {
    this.brandService.getAllBrands().subscribe(
      (response) => {
        console.log("brands", response);
        this.brands = response;
      },
      (err) => {
        console.log(err);
      },
    );
  }
  getSales() {
    this.salesService.getAllSales().subscribe(
      (response) => {
        console.log("sales", response);
        this.sales = response;
      },
      (err) => {
        console.log(err);
      },
    );
  }
  getPaymentPurchases() {
    this.paymentPurchaseService.getAllPaymentPurchases().subscribe(
      (response) => {
        console.log("paymentPurchase", response);
        this.paymentPurchase = response;
      },
      (err) => {
        console.log(err);
      },
    );
  }
  getUnits() {
    this.unitService.getAllUnits().subscribe(
      (response) => {
        console.log("Units", response);

        this.units = response;
      },
      (err) => {
        console.log(err);
      },
    );
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return false;
    }
    this.isLoader = true;
    this.productService.createProduct(this.form.value).subscribe(
      (response) => {
        console.log("product", response);
        Swal.fire("Product Created", "", "success");
        this.updateImages(response);

      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured during creation", "", "error");
      },
    );
  }

  updateImages(product: any) {
    let imageList = {
      id: product.id,
      product_Images: []
    }

    this.uploader.queue.forEach((item: any, index) => {
      this.patchImage(item).then(res => {
        let imageObj = {
          id: Math.floor((Math.random() * 10000000) + 1),
          isMain: item._file.isMain,
          image: res

        }
        imageList.product_Images.push(imageObj);
        if (this.uploader.queue.length == index + 1) {
          this.productService.UpdateImages(imageList).subscribe(res => {
            this.isLoader = false;
            this.form.reset();
            this.router.navigate(["/product/view"]);
          });
        }
      });

    })

  }
  get f() {
    return this.form.controls;
  }



}
