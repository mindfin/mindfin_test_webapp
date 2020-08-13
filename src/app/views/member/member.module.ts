import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MemberRoutingModule} from './member-routing.module';
import { HomeComponent } from './home.component';
import { ChangepwdComponent } from './changepwd.component';
import { CustomerprofileComponent } from './customerprofile.component';
import {MatDatepickerModule, MatNativeDateModule, MatInputModule,MatFormFieldModule,
  MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, 
  MatBadgeModule, MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule} from '@angular/material';
import { AddperiodComponent } from './addperiod.component';
import { EditemployeeComponent } from './editemployee.component';
import { EmployeetypeComponent } from './employeetype.component';
import { EmployeelistComponent, EmpdialogContent } from './employeelist.component';
import { EmpPasswordComponent } from './emppassword.component';
import { LoantypeComponent } from './loantype.component';
import { BankComponent } from './bank.component';
import { UserComponent } from './user.component';
import { SettingsComponent } from './settings.component';
import { BulksmsComponent } from './bulksms.component';
import { ViewdetailsComponent } from './viewdetails.component';
import { ChecktrackComponent } from './checktrack.component';
import { TrackComponent } from './track.component';
import { EmployeeComponent } from './employee.component';
import { ContactComponent } from './contact.component';
import { CareerComponent } from './career.component';
import { CallbackComponent } from './callback.component';
import { DeletedEmployeelistComponent } from './deletedemployeelist.component';
import { IndiConveniencslistComponent } from './viewindiconve.component';
import { IndiLeaveApplistComponent } from './viewindileaveapp.component';
import { IndiSuggestionlistComponent } from './viewindisugge.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatNativeDateModule,MatInputModule,
    MatDatepickerModule,MatFormFieldModule,MatBadgeModule,MatButtonModule,MatButtonToggleModule,
    MatPaginatorModule,MatSortModule,MatProgressSpinnerModule,MatTableModule,MemberRoutingModule,
    BsDatepickerModule.forRoot(),MatIconModule,MatDialogModule
    
  ],
  declarations: [HomeComponent,ChangepwdComponent,CustomerprofileComponent,AddperiodComponent,
    EditemployeeComponent,EmployeetypeComponent,EmployeelistComponent,EmpPasswordComponent,
    LoantypeComponent,BankComponent,UserComponent,SettingsComponent,BulksmsComponent,ViewdetailsComponent,
    EmpdialogContent,ChecktrackComponent,TrackComponent,EmployeeComponent,CareerComponent,ContactComponent,CallbackComponent,
    DeletedEmployeelistComponent,IndiConveniencslistComponent,IndiLeaveApplistComponent,IndiSuggestionlistComponent
 ],
  entryComponents: [EmployeelistComponent,EmpdialogContent,DeletedEmployeelistComponent
  ],
})
export class MemberModule { }
