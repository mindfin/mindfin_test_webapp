
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';


export interface User { 
  name: string;
}
@Component({
  templateUrl: 'addeventcalendar.component.html',
})

export class AddEventCalendarComponent {
  myControl = new FormControl();
  val: any = [];
  empid: any;
  empname:any;
  value1:any;
  abc:any;
  constructor(private service: SuperadminService, private router: Router, private commonservice: CommonService) { }

  model: any = {};
  fetchData: any;


  ngOnInit() {
    
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    this.commonservice.getEvent().subscribe(res => {
      console.log(res);
      this.fetchData = res;
    })
  }
  refresh() {
    window.location.reload();
  }
  addEvent(value) {
    console.log(value);
    this.abc = this.model.color.split(",", 3);
    this.value1 = {
      value: value, empid: this.empid, empname: this.empname,
      abc: this.abc
    }
    console.log(this.value1);
    this.commonservice.addEvent(this.value1)
      .subscribe(res => {
        this.ngOnInit();
     
      })
  }
  deleteEvent(value) {
    console.log(value);
   
    this.commonservice.deleteEvent(value)
      .subscribe(res => {
        this.ngOnInit();
     
      })
  }
 
}