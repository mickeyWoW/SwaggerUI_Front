import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { WarehouseService } from "src/app/core/services/warehouse.service";

@Component({
  selector: "app-barcode",
  templateUrl: "./barcode.component.html",
  styleUrls: ["./barcode.component.scss"],
})
export class BarcodeComponent implements OnInit {
  form: FormGroup;
  warehouses: any;
  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllWarehouses();
  }
  createForm() {
    this.form = this.fb.group({});
  }

  getAllWarehouses() {
    this.warehouseService.getAllWarehouses().subscribe((response) => {
      console.log("Warehouses", response);
      this.warehouses = response;
    });
  }
}
