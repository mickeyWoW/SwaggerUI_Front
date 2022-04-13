import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { BARCODE_SYMBOLOGY } from "src/app/@constants/barcode_symbology";
import { TAX_TYPES } from "src/app/@constants/tax_method";
import { BrandService } from "src/app/core/services/brand.service";
import { CategoryService } from "src/app/core/services/category.service";
import { PaymentPurchaseService } from "src/app/core/services/PaymentPurchase.service";
import { ProductService } from "src/app/core/services/product.service";
import { SalesService } from "src/app/core/services/sales.service";
import { UnitService } from "src/app/core/services/unit.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.scss"],
})
export class EditProductComponent implements OnInit {
  form: FormGroup;
  isLoader = false;
  isSubmitted = false;
  image = null;
  //Arrays from constants
  barcode_sybmology = BARCODE_SYMBOLOGY;
  taxTypes = TAX_TYPES;
  // Arrays
  categories: any;
  brands: any;
  sales: any;
  paymentPurchase: any;
  units: any;
  productID: any;

  APIURL = 'https://evening-anchorage-3159.herokuapp.com/api/';
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  localImageUrl: any;
  product_Images: any = [];
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private salesService: SalesService,
    private unitService: UnitService,
    private paymentPurchaseService: PaymentPurchaseService,
    private router: Router,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.createForm();
    this.getParams();
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
      Type_barcode: [null, Validators.required],
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
  getParams() {
    this.isLoader = true;
    this.route.params.subscribe((params) => {
      console.log(params);
      this.productID = params.id;
      this.productService.getProductById(params.id).subscribe(
        (response) => {
          console.log("product", response);
          this.form.patchValue(response);
          this.isLoader = false;
          this.product_Images = response.product_Images;
        },
        (err) => {
          console.log(err);
        },
      );
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
      return;
    }
    this.isLoader = true;
    this.productService
      .updateProduct({ id: this.productID, ...this.form.value }, this.productID)
      .subscribe(
        (response) => {
          console.log("product", response);
         
          this.updateImages(response);
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

  getImage(fileItem: any) {
    let url = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  checkChange(item: any, event: any) {
    this.product_Images.forEach((item: any, index: any) => {
      item.isMain = false;
    })
    item.isMain = event.target.checked;

  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  deleteImage(id: any) {
    this.product_Images = this.product_Images.filter(m => m.id != id);
  }

  updateImages(product: any) {
    let imageList = {
      id: product.id,
      product_Images: []
    }

    //add existing images
    if(this.product_Images)
    imageList.product_Images=this.product_Images;

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
            Swal.fire("Product Updated", "", "success");
            this.router.navigate(["/product/view"]);
          });
        }
      });

    
    })

    if(this.uploader.queue.length == 0){
      this.productService.UpdateImages(imageList).subscribe(res => {
        this.isLoader = false;
        this.form.reset();
        Swal.fire("Product Updated", "", "success");
        this.router.navigate(["/product/view"]);
      });
    }

  }
}
