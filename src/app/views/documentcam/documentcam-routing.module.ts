import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentCamComponent } from './documentcam.component';
const routes: Routes = [

  {
    path: 'documentcam',
    component: DocumentCamComponent,
    data: {
      title: 'Doument Cam'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentCamRoutingModule { }
