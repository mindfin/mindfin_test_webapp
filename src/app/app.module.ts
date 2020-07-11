import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent, SugboxDialogContent, ConvenienceDialogContent, LeaveAppDialogContent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
// import { SuperadminComponent } from './views/login/superadmin.component';
// import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent,SugboxDialogContent,ConvenienceDialogContent,LeaveAppDialogContent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepicker, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, 
  MatInputModule, MatProgressSpinnerModule, MatBadgeModule, MatButtonModule, MatButtonToggleModule} from '@angular/material';
import { CommonService } from './common.service';
import{ SampleService } from './sample.service';
import { HttpModule, Http } from '@angular/http';
import { MemberService } from './member.service';
import { MemberloginComponent } from './views/login/memberlogin.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { SuperadminService } from './superadmin.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpModule,
    MomentModule,
    BrowserAnimationsModule,
    NgIdleKeepaliveModule.forRoot(),
    BsDatepickerModule.forRoot()
  

  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    MemberloginComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
    
  },CommonService,SuperadminService
  ,SampleService,MemberService
],
  bootstrap: [ AppComponent ],
  entryComponents: [SugboxDialogContent,ConvenienceDialogContent,LeaveAppDialogContent
  ]
})
export class AppModule { }
