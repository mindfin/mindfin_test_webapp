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
      title:' Enquiry Data List'
    }
  },
  {
    path:'teledisbursdatalist',
    component:TeleDisbursdatalistComponent,
    data:{
      title:' Enquiry Disbursed Data List'
    }
  },
  {
    path:'teleapprovedatalist',
    component:TeleApproveddatalistComponent,
    data:{
      title:' Enquiry Approved Data List'
    }
  },
  {
    path:'telerejectdatalist',
    component:  TeleRejectdatalistComponent
    ,
    data:{
      title:' Enquiry Reject Data List'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelecallerRoutingModule { }