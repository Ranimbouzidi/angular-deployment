// filter.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], role: string): any[] {
    if (!items || !role) {
      return items;
    }

    return items.filter(item => item.role === role);
  }
}