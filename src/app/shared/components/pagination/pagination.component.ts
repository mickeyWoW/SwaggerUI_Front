import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() pageNumber: number;
  @Input() total: number;
  @Input() pageSize: number;

  @Output() pageChangeEvent = new EventEmitter<{pageNumber:any,pageSize:any}>();

  showFrom:any;
  showTo:any;
  constructor() {
   

   }

  ngOnInit(): void {
    this.UpdatePaginationDetails();
   }

  onPageChange(pageNumber: number) {
    console.log(pageNumber);
    this.pageNumber = pageNumber;
    this.UpdatePaginationDetails();
    this.pageChangeEvent.emit({pageNumber:this.pageNumber,pageSize:this.pageSize});
  }

  updatePageSize(event){
    this.pageSize= Number(event.target.value);
    this.onPageChange(this.pageNumber);
  }

  UpdatePaginationDetails(){
    this.showFrom = ((this.pageNumber-1)  * this.pageSize)+1;
    this.showTo = (this.showFrom + this.pageSize) ;
    console.log(this.showFrom);
    console.log(this.showTo);
  }
}
