import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { ExcelService } from "../../../core/services/excel.service";
import { PDFService } from "../../../core/services/pdf.service";
import { ProductService } from "../../../core/services/product.service";
import { CategoryService } from "../../../core/services/category.service";
import { BrandService } from "../../../core/services/brand.service";
import Swal from "sweetalert2";
import { ViewEncapsulation } from '@angular/core';
import * as XLSX from "xlsx";
import { SearchFilter } from '../search.module';
// import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: "app-view-product",
  templateUrl: "./view-product.component.html",
  styleUrls: ["./view-product.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ViewProductComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild("table") table: ElementRef;
  @ViewChild("inputFile") inputFile: ElementRef;
  keys: string[];
  dataSheet = new Subject();
  search: any;
  closeModal: string;
  searchControl: FormControl = new FormControl();
  products: any = [];
  category: any = [];
  brand: any = [];
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
  searchdata: SearchFilter = {} as any;
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

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    this.getAllProducts();
    this.onOptionsSelected();
    this.getAllBrands();
  }

  getAllProducts() {
    this.isLoader = true;
    this.productService.getAllProducts({ pageNumber: this.pageNumber, pageSize: this.pageSize }).subscribe(
      (response) => {
        if (response && response.Products) {
          this.total = response.Total;
          this.products = [];
          this.products = response.Products;
          this.products.forEach(x => {
            x.checkbox = false;
          });
          this.isLoader = false;
          // this.rerender();
        }
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
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
    this.products.forEach((x) => {
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
    this.products[i].checkbox = !this.products[i].checkbox;
    var totalCount = 0
    $.each(this.products,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }

  getProductList(paging) {
    this.pageNumber = paging.pageNumber;
    this.pageSize = paging.pageSize;
    this.getAllProducts();
  }
  getFilteredData() {
    if (this.products.length > 0) {
      this.isLoader = true;
      this.searchdata.searchString = this.searchCode;
      this.searchdata.searchString = this.searchName;
       this.optionSelected = this.optionSelected ? this.optionSelected : '';
        this.selectedBrand = this.selectedBrand ? this.selectedBrand : '';

        this.productService.getProductsByFilters(this.searchCode, this.searchName, this.optionSelected, this.selectedBrand).subscribe(
          (response) => {
            if (response) {
    
              this.total = response.Total;
              this.products = [];
              this.products = response;
    
              this.products.forEach(x => {
                x.checkbox = false;
              });
    
              this.isLoader = false;
            }
          },
          (error) => {
            this.isLoader = false;
            Swal.fire("Error occured while retrieving the list", "", "error");
          },
        );

    }
    else if (this.products.length == 0) {
      this.getAllProducts();
    }
  }
  ResetProductData() {

    this.searchCode = '';
    this.searchName = '';
    this.optionSelected= '';
    this.selectedBrand = '';
    this.modalService.dismissAll();
    this.getAllProducts();

  }


  onOptionsSelected() {
    this.categoryService.getAllCategories().subscribe(
      (response) => {
        if (response) {
          this.category = response;
        }
      },
      (error) => {

        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }

   getAllBrands() {
    this.brandService.getAllBrands().subscribe(
      (response) => {
        if (response) {
          this.brand = response;
        }
      },
      (error) => {
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
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
