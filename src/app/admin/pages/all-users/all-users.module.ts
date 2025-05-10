import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({

  imports: [
    CommonModule,
    NgxPaginationModule  // <-- add this line
  ]
})
export class AllUsersModule { }
