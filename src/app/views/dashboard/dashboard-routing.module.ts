import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { Dashboard1Component } from './dashboard1.component';
import { Dashboard2Component } from './dashboard2.component';
import { Dashboard3Component } from './dashboard3.component';
import { Dashboard4Component } from './dashboard4.component';
import { Dashboard6Component } from './dashboard6.component';
import { Dashboard5Component } from './dashboard5.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: 'telecaller',
    component: Dashboard1Component,
    data: {
      title: 'Telecaller Dashboard'
    }
  },
  {
    path: 'dataentry',
    component: Dashboard2Component,
    data: {
      title: 'DataEntry Dashboard'
    }
  },
  {
    path: 'login',
    component: Dashboard3Component,
    data: {
      title: 'Login Dashboard'
    }
  },
  {
    path: 'executive',
    component: Dashboard4Component,
    data: {
      title: 'Executive Dashboard'
    }
  },
  
  {
    path: 'backend',
    component: Dashboard6Component,
    data: {
      title: 'Backend Dashboard'
    }
  },
  {
    path: 'backendTeamHead',
    component: Dashboard5Component,
    data: {
      title: 'Backend Team Head Dashboard'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
