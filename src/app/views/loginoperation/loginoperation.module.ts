import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule, MatNativeDateModule, MatInputModule,MatFormFieldModule, MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatBadgeModule, MatButtonModule, MatButtonToggleModule, MatDialogModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { LoginoperationRoutingModule } from './loginoperation-routing.module';
import { LoginOperationComponent } from './loginoperation.component';
import { LoginDailyRoutineComponent } from './logindailyroutine.component';
import { LoginStatusComponent } from './loginstatus.component';
import { AddLogexeSatausComponent } from './addlogexestatus.component';
import { LoginOperationViewComponent } from './loginoperationview.component';
import { LoginDailyRoutineviewComponent } from './loginviewdailyroutine.component';
import { LoginDailyRoutineEditComponent } from './logindailyroutineedit.component';



@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
   CommonModule,
   LoginoperationRoutingModule,
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
    ModalModule.forRoot()
  ],
  declarations: [ LoginOperationComponent,LoginDailyRoutineComponent,LoginStatusComponent,
    AddLogexeSatausComponent,LoginOperationViewComponent,LoginDailyRoutineviewComponent,LoginDailyRoutineEditComponent ],
  entryComponents: [
  ]
})
export class LoginoperationModule { }
