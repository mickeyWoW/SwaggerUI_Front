import { Component, OnInit } from "@angular/core";
import { ExpenseService } from "src/app/core/services/expense.service";
import { PaymentPurchaseService } from "src/app/core/services/PaymentPurchase.service";
import { PaymentPurchaseReturnService } from "src/app/core/services/PaymentPurchaseReturn.service";
import { PaymentSalesService } from "src/app/core/services/paymentSales.service";
import { PaymentSalesReturnService } from "src/app/core/services/paymentSalesReturn.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-profit-loss-report",
  templateUrl: "./profit-loss-report.component.html",
  styleUrls: ["./profit-loss-report.component.scss"],
})
export class ProfitLossReportComponent implements OnInit {
  isLoader: boolean;
  salesReport: any = 0;
  paymentSales: any = 0;
  paymentPurchases: any = 0;
  paymentPurchaseReturns: any = 0;
  paymentSalesReturns: any = 0;
  expenses: any;
  constructor(
    private paymentSalesService: PaymentSalesService,
    private paymentPurchaseService: PaymentPurchaseService,
    private paymentPurchaseReturnService: PaymentPurchaseReturnService,
    private paymentSalesReturnService: PaymentSalesReturnService,
    private expenseService: ExpenseService,
  ) {}

  ngOnInit(): void {
    this.getAllSalesPayment();
    this.getAllPaymentPurchases();
    this.getAllPaymentPurchaseReturn();
    this.getAllSalesReturnPayment();
    this.getAllExpenses();
  }
  getAllSalesPayment() {
    this.isLoader = true;
    this.paymentSalesService.getAllSalesPayment().subscribe(
      (response) => {
        console.log("paymentSales", response);
        this.isLoader = false;
        response.forEach((response) => {
          this.salesReport = this.salesReport + response.montant;
        });
        console.log(this.salesReport);
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllPaymentPurchases() {
    this.isLoader = true;
    this.paymentPurchaseService.getAllPaymentPurchases().subscribe(
      (response) => {
        console.log("paymentPurchases", response);
        this.isLoader = false;
        response.forEach((response) => {
          this.paymentPurchases = this.paymentPurchases + response.montant;
        });
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllPaymentPurchaseReturn() {
    this.isLoader = true;
    this.paymentPurchaseReturnService.getAllPaymentPurchaseReturn().subscribe(
      (response) => {
        console.log("paymentPurchaseReturns", response);
        response.forEach((response) => {
          this.paymentPurchaseReturns =
            this.paymentPurchaseReturns + response.montant;
        });
        this.isLoader = false;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllSalesReturnPayment() {
    this.isLoader = true;
    this.paymentSalesReturnService.getAllSalesReturnPayment().subscribe(
      (response) => {
        console.log("paymentSalesReturns", response);
        response.forEach((response) => {
          this.paymentSalesReturns =
            this.paymentSalesReturns + response.montant;
        });
        this.isLoader = false;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllExpenses() {
    this.isLoader = true;
    this.expenseService.getAllExpenses().subscribe(
      (response) => {
        console.log("expenses", response);
        this.isLoader = false;
        response.forEach((response) => {
          this.expenses = this.expenses + response.montant;
        });
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
}
