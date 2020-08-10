import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule, MatNativeDateModule, MatInputModule,MatFormFieldModule, MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatBadgeModule, MatButtonModule, MatButtonToggleModule, MatDialogModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';


// import { MembersComponent } from './members.component';
// import { RejectBankDialogContent, ApprovalDialogContent, ViewbankComponent } from './viewbank.component';
// import { BankapplyComponent } from './bankapply.component';
// import { ViewcustomerComponent } from './viewcustomer.component';
// import { BusinesslistComponent } from './businesslist.component';
// import { ApprovalComponent } from './approval.component';
// import { PdlistComponent } from './pdlist.component';
// import { CompletlistComponent } from './completlist.component';
// import { BankRejectComponent } from './bankreject.component';
// import { ViewmemberComponent } from './viewmember.component';
// import { MemberlistComponent } from './memberlist.component';
// import { DisbustedComponent, DisburstdialogContent } from '../extracodes/disbusted.component';
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




@NgModule({
  imports: [
    CommonModule,MembersRoutingModule,ChartsModule,FormsModule,ReactiveFormsModule,BsDropdownModule,
    MatNativeDateModule,MatInputModule,MatDatepickerModule,MatFormFieldModule,MatBadgeModule,
    MatButtonModule,MatButtonToggleModule,CdkTableModule,MatPaginatorModule,MatSortModule,MatProgressSpinnerModule,
    MatTableModule,ModalModule.forRoot(),BsDatepickerModule.forRoot(),MatDialogModule
  ],
  declarations: [MembersappComponent,DialogContent,TopuplistComponent,TopupnotifyComponent,SuccesstopuplistComponent,
    EditcustomersComponent, BankdisburseComponent,TopuplistComponent,RejectBankDialogContent,CustStatusComponent
    ,ViewCustomerComponent,BankRejectComponent,AdminCheckCaseComponent,CheckCaseDownloadComponent,ShareFileDialog
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
