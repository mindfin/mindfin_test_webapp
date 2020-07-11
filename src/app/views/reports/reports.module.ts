import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule, MatNativeDateModule, MatInputModule,MatFormFieldModule, MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatBadgeModule, MatButtonModule, MatButtonToggleModule, MatDialogModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReportsRoutingModule } from './reports-routing.module';
import { LoginReportComponent } from './loginreport.component';
import { BackendReportComponent } from './backendreport.component';
import { DataentryReportComponent } from './dataentryreport.component';
import { ExecutiveRoutineComponent } from './executiveroutine.component';
import { LoginRoutineComponent } from './loginroutine.component';
import { DatatelelistComponent } from './datatelelist.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BackendBankReportComponent } from './backendbankreport.component';
import { BackendCustomerReportComponent } from './backendcustomerreport.component';
import { WebsiteLeadReportComponent } from './websitelead.component';
import { SuperAdminTeledataApprovelistComponent, AssignDialogContent1 } from './superadminteledataapprovelist.component';
import { SuperAdminTeledataContactedlistComponent, AssignDialogContent2 } from './superadminteledatacontactedlist.component';
import { SuperAdminTeledataWIPlistComponent, AssignDialogContent9 } from './superadminteledatawiplist.component';
import { SuperAdminTeledataDisburslistComponent, AssignDialogContent3 } from './superadminteledatadisbursedlist.component';
import { SuperAdminTeledataFilePickedlistComponent, AssignDialogContent4 } from './superadminteledatafilepickedlist.component';
import { SuperAdminTeledatalistComponent, AssignDialogContent } from './superadminteledatalist.component';
import { SuperAdminTeledataLoginlistComponent, AssignDialogContent5 } from './superadminteledataloginlist.component';
import { SuperAdminTeledataNoFollowUplistComponent, AssignDialogContent6 } from './superadminteledatanofollowuplist.component';
import { SuperAdminTeledataNotOpenedlistComponent, AssignDialogContent7 } from './superadminteledatanotopenlist.component';
import { SuperAdminTeledataRejectlistComponent, AssignDialogContent8 } from './superadminteledatarejectlist.component';
import { BackendRoutineComponent } from './backendroutine.component';




@NgModule({
  imports: [
    ReportsRoutingModule,
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
    BsDatepickerModule.forRoot()

  ],
  declarations: [LoginReportComponent,BackendReportComponent,DataentryReportComponent
    ,ExecutiveRoutineComponent,LoginRoutineComponent,DatatelelistComponent,WebsiteLeadReportComponent,
    BackendBankReportComponent,BackendCustomerReportComponent,SuperAdminTeledataApprovelistComponent,
    SuperAdminTeledataContactedlistComponent,SuperAdminTeledataWIPlistComponent,SuperAdminTeledataDisburslistComponent,
    SuperAdminTeledataFilePickedlistComponent,SuperAdminTeledatalistComponent,SuperAdminTeledataLoginlistComponent,
    SuperAdminTeledataNoFollowUplistComponent,SuperAdminTeledataNotOpenedlistComponent,SuperAdminTeledataRejectlistComponent,
    AssignDialogContent,AssignDialogContent1,AssignDialogContent2,
    AssignDialogContent3,AssignDialogContent4,AssignDialogContent5,AssignDialogContent6,AssignDialogContent7,
    AssignDialogContent8,AssignDialogContent9,BackendRoutineComponent],
  entryComponents: [AssignDialogContent,AssignDialogContent1,AssignDialogContent2,
    AssignDialogContent3,AssignDialogContent4,AssignDialogContent5,AssignDialogContent6,AssignDialogContent7,
    AssignDialogContent8,AssignDialogContent9]
})
export class ReportsModule { }
