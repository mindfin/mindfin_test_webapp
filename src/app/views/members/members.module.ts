import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule, MatNativeDateModule, MatInputModule,MatFormFieldModule, 
  MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, 
  MatBadgeModule, MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { DialogContent, MembersappComponent } from './membersapp.component';
import { MembersRoutingModule } from './members-routing.module';
import { EditcustomersComponent } from './editcustomers.component';
import { BankdisburseComponent } from './bankdisburse.component';
import { TopuplistComponent } from './topuplist.component';
import { TopupnotifyComponent } from './topupnotify.component';
import { SuccesstopuplistComponent } from './successtopuplist.component';
import { NgModule } from '@angular/core';
import { CustStatusComponent, RejectBankDialogContent } from './custstatus.component';
import { ViewCustomerComponent } from './viewcustomer.component';
import { BankRejectComponent } from './bankreject.component';
import { CheckCaseDownloadComponent, ShareFileDialog } from './checkcasewithdownload.component';
import { AdminCheckCaseComponent } from './admincheckcase.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataEnterCheckCaseComponent } from './dataentrycheckcase.component';
import { BankApprovedListComponent } from './bankapprovedlist.component';
import { BankRejectListComponent } from './bankrejectlist.component';
import { BankDisbursedListComponent } from './bankdisbursedlist.component';
import { BankLoginListComponent } from './bankloginlist.component';


@NgModule({
  imports: [
    CommonModule,MembersRoutingModule,ChartsModule,FormsModule,ReactiveFormsModule,BsDropdownModule,
    MatNativeDateModule,MatInputModule,MatDatepickerModule,MatFormFieldModule,MatBadgeModule,
    MatButtonModule,MatButtonToggleModule,CdkTableModule,MatPaginatorModule,MatSortModule,MatProgressSpinnerModule,
    MatTableModule,ModalModule.forRoot(),BsDatepickerModule.forRoot(),MatDialogModule,MatIconModule
  ],
  declarations: [MembersappComponent,DialogContent,TopuplistComponent,TopupnotifyComponent,SuccesstopuplistComponent,
    EditcustomersComponent, BankdisburseComponent,TopuplistComponent,RejectBankDialogContent,CustStatusComponent
    ,ViewCustomerComponent,BankRejectComponent,AdminCheckCaseComponent,CheckCaseDownloadComponent,ShareFileDialog,
    DataEnterCheckCaseComponent,BankApprovedListComponent,BankRejectListComponent,BankDisbursedListComponent,BankLoginListComponent
    // BankRejectComponent,ApprovalDialogContent,CompletlistComponent,MembersComponent,RejectBankDialogContent,
    // BankapplyComponent,ViewcustomerComponent,BusinesslistComponent,ViewbankComponent,ApprovalComponent,
    // PdlistComponent,RejectDialogContent,ViewmemberComponent,MemberlistComponent,DisburstdialogContent,DisbustedComponent,
  ],
  entryComponents: [DialogContent,RejectBankDialogContent,ShareFileDialog
    // MembersComponent,RejectBankDialogContent,RejectDialogContentApprovalDialogContent,DisbustedComponent,DisburstdialogContent
    ,
  ],
  bootstrap: [
    // MembersComponent
  ],
  providers: []
})
export class MembersModule { }
