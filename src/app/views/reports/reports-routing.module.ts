import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { LoginReportComponent } from './loginreport.component';
import { BackendReportComponent } from './backendreport.component';
import { DataentryReportComponent } from './dataentryreport.component';
import { ExecutiveRoutineComponent } from './executiveroutine.component';
import { LoginRoutineComponent } from './loginroutine.component';
import { DatatelelistComponent } from './datatelelist.component';
import { BackendCustomerReportComponent } from './backendcustomerreport.component';
import { BackendBankReportComponent } from './backendbankreport.component';
import { WebsiteLeadReportComponent } from './websitelead.component';
import { SuperAdminTeledataApprovelistComponent } from './superadminteledataapprovelist.component';
import { SuperAdminTeledataDisburslistComponent } from './superadminteledatadisbursedlist.component';
import { SuperAdminTeledataRejectlistComponent } from './superadminteledatarejectlist.component';
import { SuperAdminTeledataLoginlistComponent } from './superadminteledataloginlist.component';
import { SuperAdminTeledataWIPlistComponent } from './superadminteledatawiplist.component';
import { SuperAdminTeledataContactedlistComponent } from './superadminteledatacontactedlist.component';
import { SuperAdminTeledataFilePickedlistComponent } from './superadminteledatafilepickedlist.component';
import { SuperAdminTeledataNotOpenedlistComponent } from './superadminteledatanotopenlist.component';
import { SuperAdminTeledataNoFollowUplistComponent } from './superadminteledatanofollowuplist.component';
import { SuperAdminTeledatalistComponent } from './superadminteledatalist.component';
import { BackendRoutineComponent } from './backendroutine.component';
import { TeleRoutineComponent } from './teleroutine.component';




const routes: Routes = [

  
      {

        path: 'logreport',
        component: LoginReportComponent,
        data: {
          title: 'Login Report'
        }
      },

      {
        path: 'backreport',
        component: BackendReportComponent,
        data: {
          title: 'Backend Report'
        }
      },
      {
        path: 'dataentryreport',
        component: DataentryReportComponent,
        data: {
          title: 'Dataentry Report'
        }
      },
      {
        path:'exeroutine',
        component:ExecutiveRoutineComponent,
        data:{
          title:'Executive Daily Routine'
        }
      },
      {
        path:'logroutine',
        component:LoginRoutineComponent,
        data:{
          title:'Login Executive Daily Routine'
        }
      },
      
      {
        path:'datatelelist',
        component:DatatelelistComponent,
        data:{
          title:'Enquired Data List'
        }
      },
      {
        path:'backendcustomerreport',
        component:BackendCustomerReportComponent,
        data:{
          title:'Backend Customer Data List'
        }
      },
      {
        path:'backendbankreport',
        component:BackendBankReportComponent,
        data:{
          title:'Backend Add Bank List'
        }
      },
      {
        path:'websitelead',
        component:WebsiteLeadReportComponent,
        data:{
          title:'Website Lead'
        }
      },
      {
        path: 'rejectdatalist',
        component:SuperAdminTeledataRejectlistComponent,
        data:{
          title:'Reject list'
        }
      },
      {
        path: 'disbursedatalist',
        component:SuperAdminTeledataDisburslistComponent,
        data:{
          title:'Disburse list'
        }
      },
      {
        path: 'approvedatalist',
        component:SuperAdminTeledataApprovelistComponent,
        data:{
          title:'Approved list'
        }
      },
      {
        path: 'logindatalist',
        component:SuperAdminTeledataLoginlistComponent,
        data:{
          title:'Login list'
        }
      },
      {
        path: 'wipdatalist',
        component:SuperAdminTeledataWIPlistComponent,
        data:{
          title:'WIP list'
        }
      },
      {
        path: 'contacteddatalist',
        component:SuperAdminTeledataContactedlistComponent,
        data:{
          title:'Contacted list'
        }
      },
      {
        path: 'filepickeddatalist',
        component:SuperAdminTeledataFilePickedlistComponent,
        data:{
          title:'File Picked list'
        }
      },
      {
        path: 'notopendatalist',
        component:SuperAdminTeledataNotOpenedlistComponent,
        data:{
          title:'Assign list not opened'
        }
      },
      {
        path: 'nofallowup',
        component:SuperAdminTeledataNoFollowUplistComponent,
        data:{
          title:'NO Follow Ups'
        }
      },
      {
        path: 'admindata',
        component:SuperAdminTeledatalistComponent,
        data:{
          title:'NO Follow Ups'
        }
      },
      {
        path: 'backendroutine',
        component:BackendRoutineComponent,
        data:{
          title:'Backend Routine'
        }
        
      },
      {
        path: 'teleroutine',
        component:TeleRoutineComponent,
        data:{
          title:'Backend Routine'
        }
        
      },

    ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
