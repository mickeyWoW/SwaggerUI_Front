import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ViewEncapsulation } from '@angular/core';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";
import Swal from "sweetalert2";
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";
import * as XLSX from "xlsx";

import { ProductService } from "../../../core/services/product.service";
import { ExcelService } from "src/app/core/services/excel.service";
import { PDFService } from "src/app/core/services/pdf.service";
import { CategoryService } from "../../../core/services/category.service";
import { BrandService } from "../../../core/services/brand.service";

import { CategoryPipe } from "src/app/shared/pipes/category.pipe";
import { BrandPipe } from "src/app/shared/pipes/brand.pipe";
import { promise } from "protractor";

import { FilterData } from "../product.service";

@Component({
  selector: "app-view-product",
  templateUrl: "./view-product.component.html",
  styleUrls: ["./view-product.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class ViewProductComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild("table") table: ElementRef;
  @ViewChild("inputFile") inputFile: ElementRef;
  keys: string[];
  dataSheet = new Subject();
  search: FilterData = {} as any;
  closeModal: string;
  searchControl: FormControl = new FormControl();
  products: any = [];
  category: any = [];
  brand: any = [];
  categoryDict: any = [];
  brandDict: any = [];
  filteredProducts;
  isLoader = false;
  isExcelFile: boolean;

  total: any;
  pageSize: any = 5;
  pageNumber: any = 1;
  closeResult: string = '';
  getData: any[];
  searchCode: string = '';
  searchName: string = '';
  searchCategoryName: string = '';
  optionSelected: any;
  selectedBrand: any;
  deletedCount: any = 0;
  constructor(
    private productService: ProductService,
    private excelService: ExcelService,
    private pdfService: PDFService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) { }


  open(content: any) {
    this.modalService.open(content, { windowClass: 'b-sidebar shadow b-sidebar-right bg-white text-dark' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async ngOnInit(): Promise<void> {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

    await this.getAllProducts();
    await this.onOptionsSelected();
    await this.getAllBrands();

    this.initSearch();
  }

  ngOnDestroy(): void {
    // We remove the last function in the global ext search array so we do not add the fn each time the component is drawn
    // /!\ This is not the ideal solution as other components may add other search function in this array, so be careful when
    // handling this global variable
    $.fn['dataTable'].ext.search.pop();
  }
  
  initSearch() {
    // $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => (
    //   console.log(data) as unknown || true
    // ));
    // $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => (
    //   !this.search || 
    //   !this.search.length || 
    //   data[2].toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || 
    //   data[3].toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || 
    //   data[4].toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || 
    //   data[5].toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || 
    //   data[6].toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || 
    //   data[7].toLowerCase().indexOf(this.search.toLowerCase()) !== -1
    // ));
    console.log(this.search);
    this.search.search = '';
    this.search.codeProduct = '';
    this.search.productName = '';
    this.search.categoryId = '';
    this.search.brandId = '';
  }

  searchData() {
    // console.log(this.products);
    // $(this.table.nativeElement).DataTable().search(this.search).draw();
  }

  getAllProducts() {
    return new Promise((resolve, reject) => {
      const categoryPipe = new CategoryPipe(this.categoryService);
      const brandPipe = new BrandPipe(this.brandService);
    
      this.isLoader = true;
      this.productService.getAllProducts({ pageNumber: this.pageNumber, pageSize: this.pageSize }).subscribe(
        (response) => {
          if (response && response.Products) {
            console.log("getAllProducts")
            this.total = response.Total;
            this.products = [];
            this.products = response.Products;
            this.products.forEach(x => {
              x.checkbox = false;
            });
            this.isLoader = false;
            console.log(this.dtTrigger.next);
            // this.rerender();
          }
          resolve('');
        },
        (error) => {
          this.isLoader = false;
          Swal.fire("Error occured while retrieving the list", "", "error");
          reject();
        },
      );
    });
  }

  onOptionsSelected() {
    return new Promise((resolve, reject) => {
      this.categoryService.getAllCategories().subscribe(
        (response) => {
          this.category = [];
          this.categoryDict = [];
          console.log("onOptionsSelected")
          if (response) {
            this.category = response;
            response.forEach(x => {
              this.categoryDict[x.id] = x;
            })
            this.products.forEach(x => {
              x.category_name = this.categoryDict[x.category_id] ? this.categoryDict[x.category_id].name : "";
            });
          }
          console.log(response);
          console.log(this.products);
          resolve('');
        },
        (error) => {

          Swal.fire("Error occured while retrieving the list", "", "error");
          reject();
        },
      );
    });
  }

   getAllBrands() {
    return new Promise((resolve, reject) => {
      this.brandService.getAllBrands().subscribe(
        (response) => {
          this.brand = [];
          this.brandDict = [];
          console.log("getAllBrands")
          if (response) {
            this.brand = response;
            response.forEach(x => {
              this.brandDict[x.id] = x;
            })
            this.products.forEach(x => {
              x.brand_name = this.brandDict[x.brand_id] ? this.brandDict[x.brand_id].name : "";
            });
          }
          console.log(response);
          this.dtTrigger.next();
        },
        (error) => {
          Swal.fire("Error occured while retrieving the list", "", "error");
        },
      );
    });
  }

  ngAfterViewInit(): void {
  }

  getPrimaryImage(product) {
    if (product.product_Images) {
      var prod = product.product_Images.find(m => m.isMain);
      if (prod)
        return prod.image;
    }
    return "./assets/images/no-image-icon.png";
  }

  delete(product) {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.productService.deleteProductById(product.id).subscribe(
          (response) => {
            this.getAllProducts();
            this.isLoader = false;
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

  DeleteMultipleProducts() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.products,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.productService.DeleteMultipleProducts(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllProducts();
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

  printExcel() {
    this.excelService.exportAsExcelFile(this.products, "products");
  }
  printPDF() {
    this.pdfService.printPDF(this.table.nativeElement, "products");
  }
  
  onChange(evt) {
    let data, header;
    const target: DataTransfer = <DataTransfer>evt.target;
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = "";
    }
    if (this.isExcelFile) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data);
        console.log(data);
      };
    } else {
      this.inputFile.nativeElement.value = "";
    }
  }
 
  onImportClick(content) {
    document.body.classList.add("customModal");
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',windowClass:"mycustomModal"}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      document.body.classList.remove("customModal");
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
    this.deletedCount = 0;
    this.products.forEach((x) => {
      x.checkbox = e;
      this.deletedCount ++;
    });
  }
  
  checkSingle(i) {
    this.products[i].checkbox = !this.products[i].checkbox;
    this.deletedCount = 0;
    this.products.forEach((x) => {
      if(x.checkbox)
        this.deletedCount ++;
    });

    console.log(this.deletedCount);
    if(this.deletedCount) {
      document.body.classList.add("checkAllbox");
    } 
    else
    {
      document.body.classList.remove("checkAllbox");
    }
  }

  getProductList(paging) {
    this.pageNumber = paging.pageNumber;
    this.pageSize = paging.pageSize;
    this.getAllProducts();
  }

  getFilteredData() {
    this.search = {
      search: this.search.search, 
      codeProduct: this.searchCode,
      productName: this.searchName,
      categoryId: this.optionSelected,
      brandId: this.selectedBrand,
    }
  }

  ResetProductData() {

    this.search = {
      search: this.search.search, 
      codeProduct: '',
      productName: '',
      categoryId: '',
      brandId: '',
    }
    this.modalService.dismissAll();

  }


// rerender(): void {
//     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//         // Destroy the table first
//         dtInstance.destroy();
//         // Call the dtTrigger to rerender again
//         this.dtTrigger.next();
//     });
// }

}
