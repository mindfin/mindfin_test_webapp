import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { LoginOperationComponent } from './loginoperation.component';
import { LoginDailyRoutineComponent } from './logindailyroutine.component';
import { LoginStatusComponent } from './loginstatus.component';
import { AddLogexeSatausComponent } from './addlogexestatus.component';
import { LoginOperationViewComponent } from './loginoperationview.component';
import { LoginDailyRoutineviewComponent } from './loginviewdailyroutine.component';
import { LoginDailyRoutineEditComponent } from './logindailyroutineedit.component';




const routes: Routes = [
  {
    path: 'loginoperation',
    component: LoginOperationComponent,
    data: {
      title: 'Login Operatiom'
    }
  },
  {
    path: 'logindailyroutine',
    component: LoginDailyRoutineComponent,
    data: {
      title: 'Login Daily Routine'
    }
  },
  {
    path: 'loginstatus/:id',
    component: LoginStatusComponent,
    data: {
      title: 'Login Sent Form'
    }
  },
  {
    path: 'sentexelogedit/:id',
    component: AddLogexeSatausComponent,
    data: {
      title: 'Sent Login Executive'
    }
  },
  {
    path: 'loginview',
    component: LoginOperationViewComponent,
    data: {
      title: 'View Login'
    }
  },
  {
    path: 'logindailyview',
    component: LoginDailyRoutineviewComponent,
    data: {
      title: 'View Daily Routine'
    }
  },
  {
    path: 'logineditroutine/:id',
    component: LoginDailyRoutineEditComponent,
    data: {
      title: 'Sent Login Executive'
    }
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginoperationRoutingModule { }
