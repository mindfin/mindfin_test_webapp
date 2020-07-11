import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { GuestHomeComponent } from './guesthome.component';
import { GuestAppointmentComponent } from './guestappointment.component';
import { VisitorViewComponent } from './visitorView.component';




const routes: Routes = [
  
      {
        path: 'home',
        component: GuestHomeComponent,
        data: {
          title: 'Visitor Home'
        }
      },
      {
        path: 'appointment',
        component: GuestAppointmentComponent,
        data: {
          title: 'Visitor Appointment'
        }
      },
      {
        path: 'viewVisitor',
        component: VisitorViewComponent,
        data: {
          title: 'View Visitor'
        }
      },
    ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
