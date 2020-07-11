import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileSettingComponent } from './profilesettings.component';
import { AddNotificationComponent } from './addnotification.component';
import { AssignToDoComponent } from './assigntodo.component';
import { ViewNotificationComponent } from './viewnotification.component';
import { EmpNotificationComponent } from './empnotification.component';
import { SeenByComponent } from './seenby_dialog';
import { EventCalendarComponent } from './eventcalendar.component';
import { AddEventCalendarComponent } from './addeventcalendar.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Notifications'
    },
    children: [
      {
        path: 'profilesettings',
        component:ProfileSettingComponent,
        data: {
          title: 'Profile'
        }
      },
      {
        path: 'addnotification',
        component: AddNotificationComponent,
        data: {
          title: 'Add Notification'
        }
      },
      {
        path: 'assigntodo',
        component: AssignToDoComponent,
        data: {
          title: 'To Do List'
        }
      },
      {
        path: 'viewnotification',
        component: ViewNotificationComponent,
        data: {
          title: 'View Notification'
        }
      },
      {
        path: 'empnotification',
        component: EmpNotificationComponent,
        data: {
          title: 'View Notification'
        }
      },
      {
        path: 'seenby/:id',
        component: SeenByComponent,
        data: {
          title: 'Seen By '
        }
      },
      {
        path: 'events',
        component: EventCalendarComponent,
        data: {
          title: 'Mindfin Calendar '
        }
      },
      {
        path: 'addevents',
        component: AddEventCalendarComponent,
        data: {
          title: 'Mindfin Calendar '
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule {}
