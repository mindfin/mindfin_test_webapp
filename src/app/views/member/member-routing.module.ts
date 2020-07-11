import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ProfileComponent } from './profile.component';
import { HomeComponent } from './home.component';
// import { MyprojectComponent } from './myproject.component';
import { ChangepwdComponent } from './changepwd.component';
import { CustomerprofileComponent } from './customerprofile.component';
import { AddperiodComponent } from './addperiod.component';
import { EmployeeComponent } from './employee.component';
import { EmployeelistComponent } from './employeelist.component';
import { EditemployeeComponent } from './editemployee.component';
import { LoantypeComponent } from './loantype.component';
import { BankComponent } from './bank.component';
import { UserComponent } from './user.component';
import { EmployeetypeComponent } from './employeetype.component';
import { EmpPasswordComponent } from './emppassword.component';
import { SettingsComponent } from './settings.component';
import { BulksmsComponent } from './bulksms.component';
import { ViewdetailsComponent } from './viewdetails.component';
import { TrackComponent } from './track.component';
import { ChecktrackComponent } from './checktrack.component';
import { CareerComponent } from './career.component';
import { ContactComponent } from './contact.component';
import { CallbackComponent } from './callback.component';
import { DeletedEmployeelistComponent } from './deletedemployeelist.component';
import { IndiConveniencslistComponent } from './viewindiconve.component';
import { IndiLeaveApplistComponent } from './viewindileaveapp.component';
import { IndiSuggestionlistComponent } from './viewindisugge.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile'
    },
    children: [
     
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Home'
        }
      },
       
      {
        path: 'changepwd',
        component: ChangepwdComponent,
        data: {
          title: 'Change Password'
        }
      },
      
       
      {
        path: 'customerprofile',
        component: CustomerprofileComponent,
        data: {
          title: 'Customer Profile'
        }
      },
      {
        path: 'addperiod',
        component: AddperiodComponent,
        data: {
          title: 'Add period'
        }
      },
      {
        path:'employee',
        component:EmployeeComponent,
        data:{
          title:'Add Employee'
        }
      },
      {
        path:'employeelist',
        component:EmployeelistComponent,
        data:{
          title:'Employee List'
        }
      },
      {
        path:'oldemployeelist',
        component:DeletedEmployeelistComponent,
        data:{
          title:'Old Employee List'
        }
      },
      {
        path:'editemployee/:id',
        component:EditemployeeComponent,
        data:{
          title:'Edit Employee'
        }
      },
      {
        path:'loantype',
        component:LoantypeComponent,
        data:{
          title:'Add Loan Type'
        }
      },
      {
        path:'bank',
        component:BankComponent,
        data:{
          title:'Add Bank'
        }
      },
      {
        path:'user',
        component:UserComponent,
        data:{
          title:'Add User Type'
        }
      },
      {
        path:'employeetype',
        component:EmployeetypeComponent,
        data:{
          title:' Add Employeetype'
        }
      },
      {
        path:'emppassword',
        component:EmpPasswordComponent,
        data:{
          title:' Employee Password'
        }
      },
      {
        path:'settings',
        component:SettingsComponent,
        data:{
          title:'Settings'
        }
      },
      {
        path:'bulksms',
        component:BulksmsComponent,
        data:{
          title:'Bulksms'
        }
      },
   
      {
        path:'viewdetails',
        component:ViewdetailsComponent,
        data:{
          title:'Bulksms'
        }
      },
      {
        path:'track/:id',
        component:TrackComponent,
        data:{
          title:'Track List'
        }
      },
      {
        path:'checktrack',
        component:ChecktrackComponent,
        data:{
          title:'Check Tracker'
        }
      },{
        path:'contact',
        component:ContactComponent,
        data:{
          title:'Contact Form Data'
        }
      },{
        path:'career',
        component:CareerComponent,
        data:{
          title:'Career Form Data'
        }
      },{
        path:'callback',
        component:CallbackComponent,
        data:{
          title:'Callback Form Data'
        }
      },{
        path:'indiconve',
        component:IndiConveniencslistComponent,
        data:{
          title:'Conveniences Status'
        }
      },
      {
        path:'indileavapp',
        component:IndiLeaveApplistComponent,
        data:{
          title:'Leave Application Status'
        }
      },
      {
        path:'indiSuggest',
        component:IndiSuggestionlistComponent,
        data:{
          title:'Suggestion Status'
        }
      },
     
      // {
      //   path: 'profile',
      //   component: ProfileComponent,
      //   data: {
      //     title: 'Profile Information'
      //   }
      // },
      // {
      //   path: 'payment',
      //   component: MyprojectComponent,
      //   data: {
      //     title: 'Payment History'
      //   }
      // },
      
    //   {
    //     path: 'pdf',
    //     component: PdfComponent,
    //     data: {
    //       title: 'PDF Information'
    //     }
    //   },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule {}
