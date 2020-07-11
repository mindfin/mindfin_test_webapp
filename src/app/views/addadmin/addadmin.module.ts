import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AddadminComponent } from './addadmin.component';
import { addadminRoutingModule } from './addadmin-routing.module';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
   CommonModule,
    addadminRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ AddadminComponent ]
})
export class AddadminModule { }
