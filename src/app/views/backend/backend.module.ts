import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import {BackendRoutingModule } from './backend-routing.module';
import { CommonModule } from '@angular/common';
import { BackendComponent } from './backend.component';
import { BackendViewComponent, ViewDialogContent } from './backendview.component';
import {MatDatepickerModule, MatNativeDateModule, MatInputModule,MatFormFieldModule, MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatBadgeModule, MatButtonModule, MatButtonToggleModule, MatDialogModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { BackendBankapplyComponent } from './backendbankapply.component';
import { ViewBankStatusComponent, ViewDialogContent1 } from './viewbankstatus.component';
import { StatusComponent } from './status.component';
import { EditBackendComponent } from './editbackend.component';
import { CheckCaseComponent, EditDialogContent1 } from './checkcase.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BackendDailyRoutineComponent } from './backenddailyroutine.component';
import { BackendDailyRoutineviewComponent } from './backendviewdailyroutine.component';
import { BackendDailyRoutineEditComponent } from './backenddailyroutineedit.component';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
   CommonModule,
    BackendRoutingModule,
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
    BsDatepickerModule.forRoot()

  ],
  declarations: [ BackendComponent,BackendViewComponent,ViewDialogContent,ViewDialogContent1,
    BackendBankapplyComponent, ViewBankStatusComponent,StatusComponent,EditBackendComponent
    ,CheckCaseComponent,EditDialogContent1,BackendDailyRoutineComponent,
    BackendDailyRoutineviewComponent,BackendDailyRoutineEditComponent

  ],
  entryComponents: [ViewDialogContent,ViewDialogContent1,EditDialogContent1
  ]
})
export class BackendModule { }
