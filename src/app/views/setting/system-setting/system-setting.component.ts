import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CurrencyService } from "src/app/core/services/currency.service";
import { CustomerService } from "src/app/core/services/customer.service";
import { SettingsService } from "src/app/core/services/settings.service";
import { WarehouseService } from "src/app/core/services/warehouse.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-system-setting",
  templateUrl: "./system-setting.component.html",
  styleUrls: ["./system-setting.component.scss"],
})
export class SystemSettingComponent implements OnInit {
  form: FormGroup;
  isLoader: boolean;
  currencies: any;
  customers: any;
  warehouses: any;
  isSubmitted: boolean = false;
  id: any = null;
  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private customerService: CustomerService,
    private warehouseService: WarehouseService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
  ) {}

  get f() {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.createForm();
    this.getAllCurrencies();
    this.getAllCustomers();
    this.getAllWarehouses();
    this.getParams();
  }
  createForm() {
    this.form = this.fb.group({
      email : [null,Validators.required],
      currency_id: [null, Validators.required],
      CompanyName: [null, Validators.required],
      CompanyPhone: [null, Validators.required],
      CompanyAddress: [null, Validators.required],
      // logo: [null, Validators.required],
      footer: [null, Validators.required],
      developed_by: [null, Validators.required],
      client_id: [null, Validators.required],
      warehouse_id: [null, Validators.required],
      default_language: [null, Validators.required],
    });
  }
  getAllCurrencies() {
    this.isLoader = true;
    this.currencyService.getAllCurrencies().subscribe(
      (response) => {
        console.log("currencies", response);
        this.isLoader = false;
        this.currencies = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllCustomers() {
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
  getAllWarehouses() {
    this.isLoader = true;
    this.warehouseService.getAllWarehouses().subscribe(
      (response) => {
        console.log("warehouses", response);
        this.isLoader = false;
        this.warehouses = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  patchImage(event) {
    console.log(event);
    console.log(event.target.files[0]);
    console.log(event);
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    console.log(file);

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      console.log(reader);
      console.log(reader);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.form.patchValue({ logo: reader.result });
        console.log(this.form.value);
      };
    }
  }

  onSubmit() {
    console.log(this.form.value);
    this.isLoader = true;
    this.isSubmitted=true;
    if (this.form.invalid) {
      Swal.fire("Some fields are missing", "", "error");
      return;
    }

    if(this.id !="")
    {
      this.settingsService.editSettingsById({ ...this.form.value, id: this.id}, this.id).subscribe(
        (response) => {
          console.log("settings", response);
          Swal.fire("Setting Updated", "", "success");
          this.isLoader = false;
      // this.form.reset();
        },
        (error) => {
          this.isLoader = false;
  
          Swal.fire("Error occured during creation", "", "error");
        },
      );
    }
else 
{
this.settingsService.createSettings(this.form.value).subscribe(
      (response) => {
        console.log("settings", response);
        Swal.fire("Setting Created", "", "success");
        this.isLoader = false;
    this.form.reset();
      },
      (error) => {
        this.isLoader = false;

        Swal.fire("Error occured during creation", "", "error");
      },
    );
}
    
  }

  getParams() {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.id = params["id"];
      console.log(this.id);
    });
    this.settingsService.getSettingsById("61eab7f401714785a2305da3")
      .subscribe((response) => {
        console.log(response);
        this.form.patchValue({
          id: response.id,
          email: response.email,
          currency_id: response.currency_id,
          CompanyName: response.CompanyName,
          CompanyPhone: response.CompanyPhone,
          CompanyAddress: response.CompanyAddress,
          footer: response.footer,
          developed_by: response.developed_by,
          client_id: response.client_id,
          warehouse_id: response.warehouse_id,
          default_language: response.default_language
        });
        this.id=response.id;
        // this.date = response.date;
        // this.grandTotal = response.GrandTotal;
        // this.searchedProducts.push(...JSON.parse(response.products));
        // this.searchedProducts = JSON.parse(response.products);
      });
  }
}
