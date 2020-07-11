import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Containers
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';

import { MemberloginComponent } from './views/login/memberlogin.component';

import { AuthGuard } from './auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'member/login',
    component: MemberloginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    // data: {
    //   title: 'Home'
    // },
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'addadmin',
        canActivate: [AuthGuard],
        loadChildren: './views/addadmin/addadmin.module#AddadminModule'
      },
      {
        path: 'member',
        canActivate: [AuthGuard],
        loadChildren: './views/member/member.module#MemberModule'
      },
      {
        path: 'members',
        canActivate: [AuthGuard],
        loadChildren: './views/members/members.module#MembersModule'
      },
      {
        path: 'account',
        canActivate: [AuthGuard],
        loadChildren: './views/account/account.module#AccountModule'
      },
      {
        path: 'backend',
        canActivate: [AuthGuard],
        loadChildren: './views/backend/backend.module#BackendModule'
      },
      {
        path: 'loginoperation',
        canActivate: [AuthGuard],
        loadChildren: './views/loginoperation/loginoperation.module#LoginoperationModule'
      },
      {
        path: 'reports',
        canActivate: [AuthGuard],
        loadChildren: './views/reports/reports.module#ReportsModule'
      },
      {
        path: 'guest',
        canActivate: [AuthGuard],
        loadChildren: './views/guest/guest.module#GuestModule'
      },
      {
        path: 'executives',
        canActivate: [AuthGuard],
        loadChildren: './views/executives/executives.module#ExecutivesModule'
      },
      {
        path: 'telcaller',
        canActivate: [AuthGuard],
        loadChildren: './views/telecaller/telecaller.module#TelecallerModule'
      },
      {
        path: 'documentcam',
        canActivate: [AuthGuard],
        loadChildren: './views/documentcam/documentcam.module#DocumentCamModule'
      },
      {
        path: 'notification',
        canActivate: [AuthGuard],
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
       
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
