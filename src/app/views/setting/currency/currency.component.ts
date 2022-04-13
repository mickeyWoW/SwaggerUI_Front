import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CurrencyService } from "src/app/core/services/currency.service";
import Swal from "sweetalert2";
import { DataTableDirective } from 'angular-datatables';
import { Subject } from "rxjs";
@Component({
  selector: "app-currency",
  templateUrl: "./currency.component.html",
  styleUrls: ["./currency.component.scss"],
})
export class CurrencyComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild("modal") modal: ElementRef;
  form: FormGroup;
  search = null;
  isLoader = false;
  currencies: any = [];
  deletedCount:any=0;
  toggle = false;
  currencyId: any;
  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllCurrencies();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10 
    };
  }
  createForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
      symbol: [null, Validators.required],
    });
  }
  getAllCurrencies() {
    this.isLoader = true;
    this.currencyService.getAllCurrencies().subscribe(
      (response) => {
        console.log("currencies", response);
        this.isLoader = false;
        this.rerender();
        this.currencies = [];
        response.forEach((x) => {
          x.checkbox = false;
          this.currencies.push(x);
        });
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  onSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) {
      Swal.fire("Some fields are missing", "", "error");
      return;
    }
    this.isLoader = true;
    this.currencyService.createCurrency(this.form.value).subscribe(
      (response) => {
        console.log("currency", response);
        Swal.fire("Currency Created", "", "success");
        this.isLoader = false;
        this.form.reset();
        this.getAllCurrencies();
        this.modalService.dismissAll();
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured during creation", "", "error");
      },
    );
  }
  update() {
    if (this.form.invalid) {
      Swal.fire("Some fields are missing", "", "error");
      return;
    }
    this.isLoader = true;
    this.currencyService
      .editCurrencyById(
        { ...this.form.value, id: this.currencyId },
        this.currencyId,
      )
      .subscribe(
        (response) => {
          console.log("currency", response);
          Swal.fire("Currency Updated", "", "success");
          this.isLoader = false;
          this.getAllCurrencies();
          this.modalService.dismissAll();

          this.form.reset();
        },
        (error) => {
          this.isLoader = false;

          Swal.fire("Error occured updating currency", "", "error");
        },
      );
  }
  delete(currency) {
    Swal.fire({
      title: "Do you want to delete the currency?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoader = true;
        this.currencyService.deleteCurrencyById(currency.id).subscribe(
          (response) => {
            Swal.fire("Currency deleted successfully", "", "success");
            this.getAllCurrencies();
          },
          (err) => {
            Swal.fire("Error occured while deleting the currency", "", "error");
          },
        );
      } else if (result.isDenied) {
      }
    });
  }

  DeleteMultipleCurrency() {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var ids = [];
        $.each(this.currencies,function(i,obj) {
            if(obj.checkbox)
              ids.push(obj.id);
        });
        this.isLoader = true;
        this.currencyService.DeleteMultipleCurrency(ids).subscribe(
          (response) => {
            if(response)
            {
              this.getAllCurrencies();
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
  open() {
    this.toggle = false;
    this.modalService.open(this.modal);
  }
  openEditModal(currency) {
    this.currencyId = currency.id;
    this.toggle = true;
    this.form.patchValue(currency);
    this.modalService.open(this.modal);
  }
  // checkAll(e) {
  //   console.log(e);
  //   this.currencies.forEach((x) => {
  //     x.checkbox = e;
  //   });
  // }
  // checkSingle(i) {
  //   this.currencies[i].checkbox = !this.currencies[i].checkbox;
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
    this.currencies.forEach((x) => {
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
    this.currencies[i].checkbox = !this.currencies[i].checkbox;
    var totalCount = 0
    $.each(this.currencies,function(i,obj) {
      if(obj.checkbox)
        totalCount++;
    });
    this.deletedCount=totalCount;
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
}

rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
    });
}

}
