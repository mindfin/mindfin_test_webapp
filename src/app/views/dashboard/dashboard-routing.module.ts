import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { Dashboard1Component } from './dashboard1.component';
import { Dashboard2Component } from './dashboard2.component';
import { Dashboard3Component } from './dashboard3.component';
import { Dashboard4Component } from './dashboard4.component';
import { Dashboard6Component } from './dashboard6.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard v2.0'
    }
  },
  {
    path: 'telecaller',
    component: Dashboard1Component,
    data: {
      title: 'Telecaller Dashboard v2.0'
    }
  },
  {
    path: 'dataentry',
    component: Dashboard2Component,
    data: {
      title: 'Data Entry Dashboard'
    }
  },
  {
    path: 'login',
    component: Dashboard3Component,
    data: {
      title: 'Login Entry Dashboard'
    }
  },
  {
    path: 'executive',
    component: Dashboard4Component,
    data: {
      title: 'Executive Entry Dashboard'
    }
  },
  
  {
    path: 'backend',
    component: Dashboard6Component,
    data: {
      title: 'Backend Entry Dashboard'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
