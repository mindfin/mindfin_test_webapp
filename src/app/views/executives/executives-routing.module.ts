import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { ExecutiveComponent } from './executive.component';
import { ExeWiseTeledatalistComponent } from './exewiseteledatalist.component';
import { ExeTeledatalistComponent } from './exeteledatalist.component';
import { TeledataEditComponent } from './teledataedit.component';
import { DailyRoutineComponent } from './dailyroutine.component';
import { DailyRoutineEditComponent } from './dailyroutineedit.component';
import { DailyRoutineviewComponent } from './viewdailyroutine.component';
import { CustomerComponent } from './customer.component';
import { ExecutivetopuplistComponent } from './executivetopuplist.component';
import { AdminTeledatalistComponent } from './adminteledatalist.component';
import { AdminTeledataEditComponent } from './adminteledataedit.component';
import { AssignExeComponent } from './assignexe.component';
import { AdminTeledataRejectlistComponent } from './adminteledatarejectlist.component';
import { AdminTeledataDisburslistComponent } from './adminteledatadisbursedlist.component';
import { AdminTeledataLoginlistComponent } from './adminteledataloginlist.component';
import { AdminTeledataWIPlistComponent } from './adminteledatawiplist.component';
import { AdminTeledataContactedlistComponent } from './adminteledatacontactedlist.component';
import { AdminTeledataFilePickedlistComponent } from './adminteledatafilepickedlist.component';
import { AdminTeledataNotOpenedlistComponent } from './adminteledatanotopenlist.component';
import { AdminTeledataApprovelistComponent } from './adminteledataapprovelist.component';
import { AdminTeledataNoFollowUplistComponent } from './adminteledatanofollowuplist.component';




const routes: Routes = [
  {

    // path: 'executives',
    // data: {
    //   title: 'executives'
    // },
    // children: [
      // {
        path: 'viewexecutives',
        component: ExecutiveComponent,
        data: {
          title: 'View Executive'
        }
      },
      {
        path: 'exeteledatalist1/:id',
        component: ExeWiseTeledatalistComponent,
        data: {
          title: 'Telecaller Data List'
        }
      },

      {
        path:'exeteledatalist',
        component:ExeTeledatalistComponent,
        data:{
          title:'Telecaller Data List'
        }
      },
      {
        path:'editenquiry/:id',
        component:TeledataEditComponent,
        data:{
          title:'Edit TeleData'
        }
      },
      {
        path: 'dailyroutine',
        component:DailyRoutineComponent,
        data:{
          title:'Daily Routine'
        }
      },
      {
        path: 'dailyroutineview',
        component:DailyRoutineviewComponent,
        data:{
          title:'view Daily Routine'
        }
      },
      {
        path:'editroutine/:id',
        component:DailyRoutineEditComponent,
        data:{
          title:'Edit Routine'
        }
      },
      {
        path: 'customer',
        component: CustomerComponent,
        data: {
          title: 'Customers List'
        }
      },
      {
        path: 'topuplist/:id',
        component: ExecutivetopuplistComponent,
        data: {
          title: 'Topup List'
        }
      },
      {
        path: 'admindata',
        component:AdminTeledatalistComponent,
        data:{
          title:'Admin view teledata'
        }
      },
      {
        path:'admineditenquiry/:id',
        component:AdminTeledataEditComponent,
        data:{
          title:'Edit TeleData'
        }
      },
      {
        path: 'assignedlist',
        component:AssignExeComponent,
        data:{
          title:'Assigned list'
        }
      },
      {
        path: 'rejectdatalist',
        component:AdminTeledataRejectlistComponent,
        data:{
          title:'Reject list'
        }
      },
      {
        path: 'disbursedatalist',
        component:AdminTeledataDisburslistComponent,
        data:{
          title:'Disburse list'
        }
      },
      {
        path: 'approvedatalist',
        component:AdminTeledataApprovelistComponent,
        data:{
          title:'Approved list'
        }
      },
      {
        path: 'logindatalist',
        component:AdminTeledataLoginlistComponent,
        data:{
          title:'Login list'
        }
      },
      {
        path: 'wipdatalist',
        component:AdminTeledataWIPlistComponent,
        data:{
          title:'WIP list'
        }
      },
      {
        path: 'contacteddatalist',
        component:AdminTeledataContactedlistComponent,
        data:{
          title:'Contacted list'
        }
      },
      {
        path: 'filepickeddatalist',
        component:AdminTeledataFilePickedlistComponent,
        data:{
          title:'File Picked list'
        }
      },
      {
        path: 'notopendatalist',
        component:AdminTeledataNotOpenedlistComponent,
        data:{
          title:'Assign list not opened'
        }
      },
      {
        path: 'nofallowup',
        component:AdminTeledataNoFollowUplistComponent,
        data:{
          title:'NO Follow Ups'
        }
      },
  //   ]
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutivesRoutingModule { }
