import { Pipe, PipeTransform } from '@angular/core';

import { CategoryService } from 'src/app/core/services/category.service';

import { FilterData } from 'src/app/views/product/product.service';

@Pipe({
  name: 'dataTableFilter'
})
export class DataTableFilterPipe implements PipeTransform {
  transform(items: any[], filter: FilterData): any {
      if (!items || !filter) {
          return items;
      }
      // filter items array, items which match and return true will be
      // kept, false will be filtered out
      console.log(items);
      console.log(filter);
      return items.filter(item => ((
        !filter.search || 
        (item.name && item.name.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1) || 
        (item.code && item.code.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1) || 
        (item.category_name && item.category_name.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1) || 
        (item.brand_name && item.brand_name.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1) || 
        (item.price && item.price.toString().indexOf(filter.search) !== -1) || 
        (item.unit_id && item.unit_id.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1) || 
        (item.stock_alert && item.stock_alert.toString().indexOf(filter.search) !== -1)
      ) && (
        !filter.codeProduct || 
        (item.code && item.code.toLowerCase().indexOf(filter.codeProduct.toLowerCase()) !== -1)
      ) && (
        !filter.productName || 
        (item.name && item.name.toLowerCase().indexOf(filter.productName.toLowerCase()) !== -1)
      ) && (
        !filter.categoryId || 
        (item.category_id && item.category_id == filter.categoryId)
      ) && (
        !filter.brandId || 
        (item.brand_id && item.brand_id == filter.brandId)
      )));
  }

}
