import { Pipe, PipeTransform } from '@angular/core';

import { CategoryService } from 'src/app/core/services/category.service';

@Pipe({
  name: 'dataTableFilter'
})
export class DataTableFilterPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
      if (!items || !filter) {
          return items;
      }
      // filter items array, items which match and return true will be
      // kept, false will be filtered out
      console.log(items);
      console.log(filter);
      return items.filter(item => (
        !filter || 
        (item.name && item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) || 
        (item.code && item.code.toLowerCase().indexOf(filter.toLowerCase()) !== -1) || 
        (item.category_name && item.category_name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) || 
        (item.brand_name && item.brand_name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) || 
        (item.price && item.price.toString().indexOf(filter) !== -1) || 
        (item.unit_id && item.unit_id.toLowerCase().indexOf(filter.toLowerCase()) !== -1) || 
        (item.stock_alert && item.stock_alert.toString().indexOf(filter) !== -1)
      ));
  }

}
