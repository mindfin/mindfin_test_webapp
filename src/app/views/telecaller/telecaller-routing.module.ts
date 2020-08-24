import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { TeledataComponent } from './teledata.component';
import { TeledatalistComponent } from './teledatalist.component';
import { TeleDisbursdatalistComponent } from './teledisbuseddatalist.component';
import { TeleRejectdatalistComponent } from './telerejectdatalist.component';
import { TeleApproveddatalistComponent } from './teleapproveddatalist.component';
import { TeleDailyRoutineComponent } from './teledailyroutine.component';
import { TeleDailyRoutineviewComponent } from './televiewdailyroutine.component';





const routes: Routes = [
  
     
  {
    path: 'addenquiry',
    component: TeledataComponent,
    data: {
      title: 'Add Enquiry'
    }
  },
  {
    path:'teledatalist',
    component:TeledatalistComponent,
    data:{
      title:' Enquiry Lead List'
    }
  },
  {
    path:'teledisbursdatalist',
    component:TeleDisbursdatalistComponent,
    data:{
      title:' Enquiry Disbursed Lead List'
    }
  },
  {
    path:'teleapprovedatalist',
    component:TeleApproveddatalistComponent,
    data:{
      title:' Enquiry Approved Lead List'
    }
  },
  {
    path:'telerejectdatalist',
    component:  TeleRejectdatalistComponent
    ,
    data:{
      title:' Enquiry Reject Lead List'
    }
  },
  {
    path:'teledailyroutine',
    component:  TeleDailyRoutineComponent
    ,
    data:{
      title:' Tele Daily Routine'
    }
  },
  {
    path:'teledailyroutineview',
    component:  TeleDailyRoutineviewComponent
    ,
    data:{
      title:'Tele Daily Routine View'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelecallerRoutingModule { }
