(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{1112:function(e,t,a){"use strict";a.r(t);var s=a(0),r=a.n(s),n=a(8),l=(a(17),{metaInfo:{title:"Payment Sale Returns"},data:function(){return{isLoading:!0,serverParams:{sort:{field:"id",type:"desc"},page:1,perPage:10},limit:"10",search:"",totalRows:"",Filter_client:"",Filter_Ref:"",Filter_date:"",Filter_return:"",Filter_Reg:"",payments:[],clients:[],sale_returns:[]}},computed:{columns:function(){return[{label:this.$t("date"),field:"date",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Reference"),field:"Ref",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Return"),field:"Ref_return",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Customer"),field:"client_name",tdClass:"text-left",thClass:"text-left"},{label:this.$t("ModePaiement"),field:"Reglement",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Amount"),field:"montant",tdClass:"text-left",thClass:"text-left"}]}},methods:{updateParams:function(e){this.serverParams=Object.assign({},this.serverParams,e)},onPageChange:function(e){var t=e.currentPage;this.serverParams.page!==t&&(this.updateParams({page:t}),this.Payments_sale_returns(t))},onPerPageChange:function(e){var t=e.currentPerPage;this.limit!==t&&(this.limit=t,this.updateParams({page:1,perPage:t}),this.Payments_sale_returns(1))},onSortChange:function(e){var t="";t="Ref_return"==e[0].field?"sale_return_id":e[0].field,this.updateParams({sort:{type:e[0].type,field:t}}),this.Payments_sale_returns(this.serverParams.page)},onSearch:function(e){this.search=e.searchTerm,this.Payments_sale_returns(this.serverParams.page)},Reset_Filter:function(){this.search="",this.Filter_client="",this.Filter_Ref="",this.Filter_date="",this.Filter_return="",this.Filter_Reg="",this.Payments_sale_returns(this.serverParams.page)},setToStrings:function(){null===this.Filter_client?this.Filter_client="":null===this.Filter_return&&(this.Filter_return="")},Payment_PDF:function(){var e=new n.default("p","pt");e.autoTable([{title:"Date",dataKey:"date"},{title:"Ref",dataKey:"Ref"},{title:"Return",dataKey:"Ref_return"},{title:"Client",dataKey:"client_name"},{title:"Paid by",dataKey:"Reglement"},{title:"Amount",dataKey:"montant"}],this.payments),e.text("Payments Sale Returns",40,25),e.save("Payments_Sale_Returns.pdf")},Payment_Excel:function(){r.a.start(),r.a.set(.1),axios.get("payment/returns_sale/export/Excel",{responseType:"blob",headers:{"Content-Type":"application/json"}}).then((function(e){var t=window.URL.createObjectURL(new Blob([e.data])),a=document.createElement("a");a.href=t,a.setAttribute("download","Payment_Sale_Returns.xlsx"),document.body.appendChild(a),a.click(),r.a.done()})).catch((function(){r.a.done()}))},Payments_sale_returns:function(e){var t=this;this.setToStrings(),r.a.start(),r.a.set(.1),this.setToStrings(),axios.get("payment/returns_sale?page="+e+"&Ref="+this.Filter_Ref+"&date="+this.Filter_date+"&client_id="+this.Filter_client+"&sale_return_id="+this.Filter_return+"&Reglement="+this.Filter_Reg+"&SortField="+this.serverParams.sort.field+"&SortType="+this.serverParams.sort.type+"&search="+this.search+"&limit="+this.limit).then((function(e){t.payments=e.data.payments,t.clients=e.data.clients,t.sale_returns=e.data.sale_returns,t.totalRows=e.data.totalRows,r.a.done(),t.isLoading=!1})).catch((function(e){r.a.done(),setTimeout((function(){t.isLoading=!1}),500)}))}},created:function(){this.Payments_sale_returns(1)}}),i=a(2),o=Object(i.a)(l,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"main-content"},[a("breadcumb",{attrs:{page:e.$t("payments_Sales_Return"),folder:e.$t("Reports")}}),e._v(" "),e.isLoading?a("div",{staticClass:"loading_page spinner spinner-primary mr-3"}):e._e(),e._v(" "),e.isLoading?e._e():a("b-card",{staticClass:"wrapper"},[a("vue-good-table",{attrs:{mode:"remote",columns:e.columns,totalRows:e.totalRows,rows:e.payments,"search-options":{placeholder:e.$t("Search_this_table"),enabled:!0},"pagination-options":{enabled:!0,mode:"records",nextLabel:"next",prevLabel:"prev"},styleClass:"table-hover tableOne vgt-table"},on:{"on-page-change":e.onPageChange,"on-per-page-change":e.onPerPageChange,"on-sort-change":e.onSortChange,"on-search":e.onSearch}},[a("div",{staticClass:"mt-2 mb-3",attrs:{slot:"table-actions"},slot:"table-actions"},[a("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.sidebar-right",modifiers:{"sidebar-right":!0}}],attrs:{variant:"outline-info ripple m-1",size:"sm"}},[a("i",{staticClass:"i-Filter-2"}),e._v("\n          "+e._s(e.$t("Filter"))+"\n        ")]),e._v(" "),a("b-button",{attrs:{size:"sm",variant:"outline-success ripple m-1"},on:{click:function(t){return e.Payment_PDF()}}},[a("i",{staticClass:"i-File-Copy"}),e._v(" PDF\n        ")]),e._v(" "),a("b-button",{attrs:{size:"sm",variant:"outline-danger ripple m-1"},on:{click:function(t){return e.Payment_Excel()}}},[a("i",{staticClass:"i-File-Excel"}),e._v(" EXCEL\n        ")])],1)])],1),e._v(" "),a("b-sidebar",{attrs:{id:"sidebar-right",title:e.$t("Filter"),"bg-variant":"white",right:"",shadow:""}},[a("div",{staticClass:"px-3 py-2"},[a("b-row",[a("b-col",{attrs:{md:"12"}},[a("b-form-group",{attrs:{label:e.$t("date")}},[a("b-form-input",{attrs:{type:"date"},model:{value:e.Filter_date,callback:function(t){e.Filter_date=t},expression:"Filter_date"}})],1)],1),e._v(" "),a("b-col",{attrs:{md:"12"}},[a("b-form-group",{attrs:{label:e.$t("Reference")}},[a("b-form-input",{attrs:{label:"Reference",placeholder:e.$t("Reference")},model:{value:e.Filter_Ref,callback:function(t){e.Filter_Ref=t},expression:"Filter_Ref"}})],1)],1),e._v(" "),a("b-col",{attrs:{md:"12"}},[a("b-form-group",{attrs:{label:e.$t("Customer")}},[a("v-select",{attrs:{reduce:function(e){return e.value},placeholder:e.$t("Choose_Customer"),options:e.clients.map((function(e){return{label:e.name,value:e.id}}))},model:{value:e.Filter_client,callback:function(t){e.Filter_client=t},expression:"Filter_client"}})],1)],1),e._v(" "),a("b-col",{attrs:{md:"12"}},[a("b-form-group",{attrs:{label:e.$t("Return")}},[a("v-select",{attrs:{reduce:function(e){return e.value},placeholder:e.$t("PleaseSelect"),options:e.sale_returns.map((function(e){return{label:e.Ref,value:e.id}}))},model:{value:e.Filter_return,callback:function(t){e.Filter_return=t},expression:"Filter_return"}})],1)],1),e._v(" "),a("b-col",{attrs:{md:"12"}},[a("b-form-group",{attrs:{label:e.$t("Paymentchoice")}},[a("v-select",{attrs:{reduce:function(e){return e.value},placeholder:e.$t("PleaseSelect"),options:[{label:"Cash",value:"Cash"},{label:"cheque",value:"cheque"},{label:"Western Union",value:"Western Union"},{label:"bank transfer",value:"bank transfer"},{label:"credit card",value:"credit card"},{label:"other",value:"other"}]},model:{value:e.Filter_Reg,callback:function(t){e.Filter_Reg=t},expression:"Filter_Reg"}})],1)],1),e._v(" "),a("b-col",{attrs:{md:"6",sm:"12"}},[a("b-button",{attrs:{variant:"primary ripple m-1",size:"sm",block:""},on:{click:function(t){return e.Payments_sale_returns(e.serverParams.page)}}},[a("i",{staticClass:"i-Filter-2"}),e._v("\n            "+e._s(e.$t("Filter"))+"\n          ")])],1),e._v(" "),a("b-col",{attrs:{md:"6",sm:"12"}},[a("b-button",{attrs:{variant:"danger ripple m-1",size:"sm",block:""},on:{click:function(t){return e.Reset_Filter()}}},[a("i",{staticClass:"i-Power-2"}),e._v("\n            "+e._s(e.$t("Reset"))+"\n          ")])],1)],1)],1)])],1)}),[],!1,null,null,null);t.default=o.exports}}]);