import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

// import { MembersComponent } from './omponent';
import { SubvendorComponent} from './subvendor.component';
import { CustomerlistComponent } from './customerlist.component';
import { DisburselistComponent } from './disburselist.component';
import { ReloanComponent } from './reloan.component';
import { ConveniencslistComponent } from './viewconve.component';
import { LeaveApplistComponent } from './viewleaveapp.component';
import { SuggestionlistComponent } from './viewsugge.component';
import { EarlyGoComponent } from './earlygo.component';
import { EarlygolistComponent } from './viewearlygo.component';
import { EmployeeEarlygolistComponent } from './empviewearlygo.component';

// import { BankComponent } from './bank.component';





const routes: Routes = [
  {
   
    path: '',
    data: {
      title: 'Account'
    },
    children:[
      {
        path:'subvendor',
        component:SubvendorComponent,
        data:{
          title:'Sub Vendor'
        }
      },
      {
        path:'customerlist/:id',
        component:CustomerlistComponent,
        data:{
          title:'Customer list'
        }
      },
  
      {
        path:'disburselist',
        component:DisburselistComponent,
        data:{
          title:'Disburse list'
        }
      },
 
      {
        path:'reloan/:id',
        component:ReloanComponent,
        data:{
          title:'Apply Loan'
        }
      },
            {
        path:'conveniencs',
        component:ConveniencslistComponent,
        data:{
          title:'Conveniencs'
        }
      },
      {
        path:'leaveapp',
        component:LeaveApplistComponent,
        data:{
          title:'Leave Applications'
        }
      },
      {
        path:'suggestion',
        component:SuggestionlistComponent,
        data:{
          title:'Suggestions'
        }
      },
      {
        path:'lego',
        component:EarlyGoComponent,
        data:{
          title:'Late And Early Go'
        }
      },
      {
        path:'viewEarlygo',
        component:EarlygolistComponent,
        data:{
          title:'Late And Early Go Status'
        }
      },
      {
        path:'viewEmpEarlygo',
        component:EmployeeEarlygolistComponent,
        data:{
          title:'Late And Early Go Status'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
