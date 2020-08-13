import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule, MatNativeDateModule, MatInputModule,
  MatFormFieldModule, MatPaginatorModule, MatSortModule, MatTableModule,
   MatProgressSpinnerModule, MatBadgeModule, MatButtonModule, MatButtonToggleModule,
    MatDialogModule,MatIconModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GuestRoutingModule } from './guest-routing.module';
import { GuestHomeComponent } from './guesthome.component';
import { GuestAppointmentComponent } from './guestappointment.component';
import { VisitorViewComponent, ViewVisitorDialogContent, VisitorResponseDialogContent } from './visitorView.component';




@NgModule({
  imports: [
    GuestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
   CommonModule,
    ChartsModule,
    BsDropdownModule,
    ReactiveFormsModule,
   CommonModule,
    ChartsModule,
    BsDropdownModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDialogModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatIconModule

  ],
  declarations: [GuestHomeComponent,GuestAppointmentComponent,VisitorViewComponent,ViewVisitorDialogContent,
    VisitorResponseDialogContent],
  entryComponents: [ViewVisitorDialogContent,VisitorResponseDialogContent]
})
export class GuestModule { }
