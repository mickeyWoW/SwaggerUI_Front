import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, OnInit } from "@angular/core";
import { EChartOption } from "echarts";
import { PaymentSalesReturnService } from "src/app/core/services/paymentSalesReturn.service";
import { PurchaseService } from "src/app/core/services/purchase.service";
import { SalesService } from "src/app/core/services/sales.service";
import Swal from "sweetalert2";
import { echartStyles } from "../../../shared/echart-styles";

@Component({
  selector: "app-dashboad-default",
  templateUrl: "./dashboad-default.component.html",
  styleUrls: ["./dashboad-default.component.css"],
})
export class DashboadDefaultComponent implements OnInit {
  // chartLineOption1: EChartOption;
  // chartLineOption2: EChartOption;
  // chartLineOption3: EChartOption;
  salesChartBar: EChartOption;
  salesChartPie: EChartOption;
  isLoader: boolean;
  productsArray: any[] = [1, 2, 3, 4, 5,6, 7, 8, 9, 10, 11, 12];
  salesReport: any;
  topCustomers: any = [
    { client_id: 1 },
    { client_id: 2 },
    { client_id: 3 },
    { client_id: 1 },
    { client_id: 1 },
  ];
  revenue: any;
  purchase: number;
  paymentSalesReturns: any;
  salesReturn: number;
  monthArray: any = [1, 2, 3, 4, 5,6, 7, 8, 9, 10, 11, 12];
  salesArray: any = [2500, 10000, 25790, 30000, 26700, 35700, 24000, 25000, 10000, 12000, 13000, 14000];
  purchaseArray: any = [25000, 19900, 10250, 12500, 65000, 75000, 55000, 45000, 37800, 61500, 51800, 63500];

  constructor(
    private salesService: SalesService,
    private purchaseService: PurchaseService,
    private paymentSalesReturnService: PaymentSalesReturnService,
  ) { }

  ngOnInit() {
    // this.getAnnualSales();
    this.getAllSales();

    this.getAllPurchases();
    this.getAllSalesReturnPayment();
    // this.chartLineOption1 = {
    //   ...echartStyles.lineFullWidth,
    //   ...{
    //     series: [
    //       {
    //         data: [30, 40, 20, 50, 40, 80, 90],
    //         ...echartStyles.smoothLine,
    //         markArea: {
    //           label: {
    //             show: true,
    //           },
    //         },
    //         areaStyle: {
    //           color: "rgba(102, 51, 153, .2)",
    //           origin: "start",
    //         },
    //         lineStyle: {
    //           color: "#663399",
    //         },
    //         itemStyle: {
    //           color: "#663399",
    //         },
    //       },
    //     ],
    //   },
    // };
    // this.chartLineOption2 = {
    //   ...echartStyles.lineFullWidth,
    //   ...{
    //     series: [
    //       {
    //         data: [30, 10, 40, 10, 40, 20, 90],
    //         ...echartStyles.smoothLine,
    //         markArea: {
    //           label: {
    //             show: true,
    //           },
    //         },
    //         areaStyle: {
    //           color: "rgba(255, 193, 7, 0.2)",
    //           origin: "start",
    //         },
    //         lineStyle: {
    //           color: "#FFC107",
    //         },
    //         itemStyle: {
    //           color: "#FFC107",
    //         },
    //       },
    //     ],
    //   },
    // };
    // this.chartLineOption2.xAxis.data = [
    //   "Mon",
    //   "Tue",
    //   "Wed",
    //   "Thu",
    //   "Fri",
    //   "Sat",
    //   "Sun",
    // ];

    // this.chartLineOption3 = {
    //   ...echartStyles.lineNoAxis,
    //   ...{
    //     series: [
    //       {
    //         data: [
    //           40, 80, 20, 90, 30, 80, 40, 90, 20, 80, 30, 45, 50, 110, 90, 145,
    //           120, 135, 120, 140,
    //         ],
    //         lineStyle: {
    //           color: "rgba(102, 51, 153, 0.86)",
    //           width: 3,
    //           ...echartStyles.lineShadow,
    //         },
    //         label: { show: true, color: "#212121" },
    //         type: "line",
    //         smooth: true,
    //         itemStyle: {
    //           borderColor: "rgba(102, 51, 153, 1)",
    //         },
    //       },
    //     ],
    //   },
    // };
    // this.chartLineOption3.xAxis.data = ['1', '2', '3', 'Thu', 'Fri', 'Sat', 'Sun'];
  }
  getAllSales(): void {
    this.isLoader = true;
    this.salesService.getAllSales().subscribe(
      (response) => {
        if (response) {

          console.log("salesReport", response);
          this.isLoader = false;
          let revenue = 0;

          response.forEach((response) => {
            //   this.topCustomers.push({ client_id: response.client_id });
            revenue = revenue + response.GrandTotal;
            // monthsArray.push(response.data.split('-')[1])
            // console.log(response.date.split("-")[1]);
            console.log(response.date);

            if (
              response.date !== null &&
              response.date !== "string" &&
              response.date !== undefined
            ) {
              console.log(response.date);

              switch (response.date.split("-")[1]) {
                case "01":
                  this.monthArray[0] = this.monthArray[0] + response.GrandTotal;
                  break;
                case "02":
                  this.monthArray[1] = this.monthArray[1] + response.GrandTotal;
                  break;

                case "03":
                  this.monthArray[2] = this.monthArray[2] + response.GrandTotal;
                  break;
                case "04":
                  this.monthArray[3] = this.monthArray[3] + response.GrandTotal;
                  break;
                case "05":
                  this.monthArray[4] = this.monthArray[4] + response.GrandTotal;
                  break;
                case "06":
                  this.monthArray[5] = this.monthArray[5] + response.GrandTotal;
                  break;
                case "07":
                  this.monthArray[6] = this.monthArray[6] + response.GrandTotal;
                  break;
                case "08":
                  this.monthArray[7] = this.monthArray[7] + response.GrandTotal;
                  break;
                case "09":
                  this.monthArray[8] = this.monthArray[8] + response.GrandTotal;
                  break;
                case "10":
                  this.monthArray[9] = this.monthArray[9] + response.GrandTotal;
                  break;
                case "11":
                  this.monthArray[10] = this.monthArray[10] + response.GrandTotal;
                  break;
                case "12":
                  this.monthArray[11] = this.monthArray[11] + response.GrandTotal;
                  break;
              }
              let array = [];
              JSON.parse(response.products).forEach((element) => {
                if (
                  this.productsArray.filter(function (e) {
                    return e.id === element.id;
                  }).length > 0
                ) {
                  const index = this.productsArray.findIndex(
                    (x) => x.id === element.id,
                  );
                  console.log(index);
                  console.log(this.productsArray[index]);
                  console.log(this.productsArray[index].value);

                  this.productsArray[index].value =
                    +element.dummyQuantity + +this.productsArray[index].value;
                  // this.productsArray.push({ id: element.id, name: element.name, quantity: element.quantity });
                } else {
                  this.productsArray.push({
                    id: element.id,
                    name: element.name,
                    value: element.dummyQuantity,
                  });
                }
              });
              console.log(this.productsArray);
              this.productsArray.sort(
                (a, b) =>
                  parseFloat(a.dummyQuantity) - parseFloat(b.dummyQuantity),
              );
              this.productsArray = this.productsArray.splice(0, 5);
              console.log(this.productsArray);
            }
          });

          this.salesChartBar = {
            legend: {
              borderRadius: 0,
              orient: "horizontal",
              x: "right",
              data: ["Sales", "Purchases"],
            },
            grid: {
              left: "8px",
              right: "8px",
              bottom: "0",
              containLabel: true,
            },
            tooltip: {
              show: true,
              backgroundColor: "rgba(0, 0, 0, .8)",
            },
            xAxis: [
              {
                type: "category",
                data: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sept",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                axisTick: {
                  alignWithLabel: true,
                },
                splitLine: {
                  show: false,
                },
                axisLine: {
                  show: true,
                },
              },
            ],
            yAxis: [
              {
                type: "value",
                axisLabel: {
                  formatter: "${value}",
                },
                min: 0,
                max: 100000,
                interval: 20000,
                axisLine: {
                  show: false,
                },
                splitLine: {
                  show: true,
                  interval: "auto",
                },
              },
            ],
            series: [
              {
                name: "Sales",
                data: this.salesArray,
                label: { show: false, color: "#0168c1" },
                type: "bar",
                barGap: 0,
                color: "#bcbbdd",
                smooth: true,
              },
              {
                name: "Purchases",
                data: this.purchaseArray,
                label: { show: false, color: "#639" },
                type: "bar",
                color: "#7569b3",
                smooth: true,
              },
            ],
          };
          this.salesChartPie = {
            color: [
              "#62549c",
              "#7566b5",
              "#7d6cbb",
              "#8877bd",
              "#9181bd",
              "#6957af",
            ],
            tooltip: {
              show: true,
              backgroundColor: "rgba(0, 0, 0, .8)",
            },

            xAxis: [
              {
                axisLine: {
                  show: false,
                },
                splitLine: {
                  show: false,
                },
              },
            ],
            yAxis: [
              {
                axisLine: {
                  show: false,
                },
                splitLine: {
                  show: false,
                },
              },
            ],
            series: [
              {
                name: "Sales by Products",
                type: "pie",
                radius: "75%",
                center: ["50%", "50%"],
                data: this.productsArray,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          };
          console.log("revenue", revenue);
          this.revenue = revenue;
          // this.topCustomers = response;


        }
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllPurchases() {
    this.isLoader = true;
    this.purchaseService.getAllPurchases().subscribe(
      (response) => {
        console.log("purchaseReports", response);
        this.isLoader = false;
        let purchase = 0;
        response.forEach((response) => {
          //   this.topCustomers.push({ client_id: response.client_id });
          purchase = purchase + response.GrandTotal;
          if (
            response.date !== null &&
            response.date !== "string" &&
            response.date !== undefined
          ) {
            console.log(response.date);

            switch (response.date.split("-")[1]) {
              case "01":
                this.purchaseArray[0] =
                  this.purchaseArray[0] + response.GrandTotal;
                break;
              case "02":
                this.purchaseArray[1] =
                  this.purchaseArray[1] + response.GrandTotal;
                break;

              case "03":
                this.purchaseArray[2] =
                  this.purchaseArray[2] + response.GrandTotal;
                break;
              case "04":
                this.purchaseArray[3] =
                  this.purchaseArray[3] + response.GrandTotal;
                break;
              case "05":
                this.purchaseArray[4] =
                  this.purchaseArray[4] + response.GrandTotal;
                break;
              case "06":
                this.purchaseArray[5] =
                  this.purchaseArray[5] + response.GrandTotal;
                break;
              case "07":
                this.purchaseArray[6] =
                  this.purchaseArray[6] + response.GrandTotal;
                break;
              case "08":
                this.purchaseArray[7] =
                  this.purchaseArray[7] + response.GrandTotal;
                break;
              case "09":
                this.purchaseArray[8] =
                  this.purchaseArray[8] + response.GrandTotal;
                break;
              case "10":
                this.purchaseArray[9] =
                  this.purchaseArray[9] + response.GrandTotal;
                break;
              case "11":
                this.purchaseArray[10] =
                  this.purchaseArray[10] + response.GrandTotal;
                break;
              case "12":
                this.purchaseArray[11] =
                  this.purchaseArray[11] + response.GrandTotal;
                break;
            }
          }
        });

        console.log("purchases", purchase);

        this.purchase = purchase;
        // this.purchaseReports = response;
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
        this.isLoader = false;
        let salesReturn = 0;
        response.forEach((response) => {
          //   this.topCustomers.push({ client_id: response.client_id });
          salesReturn = salesReturn + response.GrandTotal;
        });
        console.log("salesReturns", salesReturn);
        this.salesReturn = salesReturn;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAnnualSales() {
    this.isLoader = true;
    this.salesService.getAnnualSales().subscribe(
      (response) => {
        console.log("getAnnualSales", response);
        this.isLoader = false;

        // this.topCustomers = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
}
