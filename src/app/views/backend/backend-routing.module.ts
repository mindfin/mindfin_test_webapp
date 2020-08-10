import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { BackendComponent } from './backend.component';
import { BackendViewComponent } from './backendview.component';
import { BackendBankapplyComponent } from './backendbankapply.component';
import { ViewBankStatusComponent } from './viewbankstatus.component';
import { StatusComponent } from './status.component';
import { EditBackendComponent } from './editbackend.component';
import { CheckCaseComponent } from './checkcase.component';
import { BackendDailyRoutineComponent } from './backenddailyroutine.component';
import { BackendDailyRoutineviewComponent } from './backendviewdailyroutine.component';
import { BackendDailyRoutineEditComponent } from './backenddailyroutineedit.component';
import { TeamHeadCheckCaseComponent } from './teamHeadcheckcase.component';
const routes: Routes = [
  {
    path: 'document',
    component: BackendComponent,
    data: {
      title: 'Upload Customer Document'
    }
  },
  {
    path: 'viewdocument',
    component: BackendViewComponent,
    data: {
      title: 'View Customer Document '
    }
  },
  {
    path: 'applybank/:id',
    component: BackendBankapplyComponent,
    data: {
      title: 'Add Bank to Customer'
    }
  },
  {
    path: 'viewbank',
    component: ViewBankStatusComponent,
    data: {
      title: 'View Bank to Customer'
    }
  },
  {
    path: 'checkcase',
    component: CheckCaseComponent,
    data: {
      title: 'Check Case'
    }
  },
  {
    path: 'teamcheckcase',
    component: TeamHeadCheckCaseComponent,
    data: {
      title: 'Check Case'
    }
  },
  {
    path: 'status/:id',
    component: StatusComponent,
    data: {
      title: 'Add Bank to Customer'
    }
  },
  {
    path: 'edit/:id',
    component: EditBackendComponent,
    data: {
      title: 'Edit customer Document'
    }
  },
  {
    path: 'dailyroutine',
    component:BackendDailyRoutineComponent,
    data:{
      title:'Daily Routine'
    }
  },
  {
    path: 'dailyroutineview',
    component:BackendDailyRoutineviewComponent,
    data:{
      title:'View Daily Routine'
    }
  },
  {
    path:'editroutine/:id',
    component:BackendDailyRoutineEditComponent,
    data:{
      title:'Edit Routine'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule {}
