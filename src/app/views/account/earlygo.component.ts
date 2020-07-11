import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';


export interface User {
  name: string;
}
@Component({
  templateUrl: './earlygo.component.html',
})

export class EarlyGoComponent {
  myControl = new FormControl();
  val: any = [];
  selectedFile: File = null;
  selectedFile1: File = null;
  selectedFile2: File = null;

  tempval: any;
  tempval1: any;
  array: any = [];
  array1: any = [];
  empid: any;
  empname: any;
  value1: any;
  constructor(private service: SuperadminService, private router: Router, private commonservice: CommonService) { }

  model: any = {};
  fetchData: any;
  fetchData1: any;
  value:any;

  currentPage = 1;
  postsPerPage = 7;
  pageSizeOptions = [7, 20, 30];

  ngOnInit() {
    this.commonservice.getemailSettings().subscribe(res => {
      console.log(res);
      this.fetchData = res;

    })
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    this.commonservice.getEarlygo(this.postsPerPage, this.currentPage,this.empid).subscribe(res => {
      // console.log(res);
      this.fetchData1 = res;
    })
    this.value={empid:this.empid}
    this.commonservice.getEarlyGoStatus(this.value).subscribe(res => {
      console.log(res);
      this.model.status = res['status'];
    })
    this.commonservice.getLateInStatus(this.value).subscribe(res => {
      console.log(res);
      this.model.status1 = res['status'];
    })
  }
  refresh() {
    window.location.reload();
  }
  onSubmit(obj) {
    console.log(obj);
    this.value1 = { value: obj, empid: this.empid, empname: this.empname, emails: this.fetchData };
    this.commonservice.earlygo(this.value1).subscribe(res => {
      alert("Applied Successfully");
      console.log(res);
      this.ngOnInit();
    })
    // this.commonservice.getbackendviewbanklist(this.custid).subscribe(res => {
    //   console.log(res);
    //   this.fetchData1 = res;
    // })
  }

}