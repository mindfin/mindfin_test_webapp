import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DashboardComponent } from './dashboard.component';
import { Dashboard1Component } from './dashboard1.component';
import { Dashboard2Component } from './dashboard2.component';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { Dashboard3Component } from './dashboard3.component';
import { Dashboard4Component } from './dashboard4.component';
import { Dashboard6Component } from './dashboard6.component';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule, 
    ButtonsModule.forRoot()
  ],
  declarations: [ DashboardComponent,Dashboard1Component,Dashboard2Component,
    Dashboard3Component,Dashboard4Component,Dashboard6Component]
})
export class DashboardModule { }
