import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { AddadminComponent } from './addadmin.component';

const routes: Routes = [
  {
    path: '',
    component: AddadminComponent,
    data: {
      title: 'Addadmin'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class addadminRoutingModule {}
