import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule, MatNativeDateModule, MatInputModule,MatFormFieldModule, MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatBadgeModule, MatButtonModule, MatButtonToggleModule, MatDialogModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table'
import { TelecallerRoutingModule } from './telecaller-routing.module';
import { TeledataComponent } from './teledata.component';
import { TeledatalistComponent } from './teledatalist.component';
import { TeleDisbursdatalistComponent } from './teledisbuseddatalist.component';
import { TeleApproveddatalistComponent } from './teleapproveddatalist.component';
import { TeleRejectdatalistComponent } from './telerejectdatalist.component';
import { TeleDailyRoutineComponent } from './teledailyroutine.component';
import { TeleDailyRoutineviewComponent } from './televiewdailyroutine.component';






@NgModule({
  imports: [
    
    FormsModule,
    ReactiveFormsModule,
   CommonModule,
    ChartsModule,
    BsDropdownModule,
    ReactiveFormsModule,
   CommonModule,
    ChartsModule,
    BsDropdownModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDialogModule,
    TelecallerRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [TeledataComponent,TeledatalistComponent,TeleDisbursdatalistComponent,TeleApproveddatalistComponent,
    TeleRejectdatalistComponent,TeleDailyRoutineComponent,TeleDailyRoutineviewComponent],
  entryComponents: [
  ]
})
export class TelecallerModule { }
