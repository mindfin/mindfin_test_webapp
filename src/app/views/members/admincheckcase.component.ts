import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';


export interface User { 
  name: string;
}
@Component({
  templateUrl: './admincheckcase.component.html',
})

export class AdminCheckCaseComponent {
  myControl = new FormControl();
  val: any = [];
  selectedFile: File = null;
  selectedFile1: File = null;
  selectedFile2: File = null;

  tempval: any;
  tempval1: any;
  array: any = [];
  array1: any = [];
  custid: any;

  constructor(private service: SuperadminService, private router: Router, private commonservice: CommonService) { }

  model: any = {};
  fetchData;
  fetchData1;


  ngOnInit() {

  }
  refresh() {
    window.location.reload();
  }
  checkcase(obj) {
    console.log(obj);
    // var idno=obj.idno;
    this.commonservice.checkcase(obj).subscribe(res => {
      console.log(res);
      // this.custid = res[0].idcustomer;
      this.fetchData = res;
    })
    // this.commonservice.backendeditemp(this.custid).subscribe(res=>{
    //   console.log(res);
    //   this.fetchData=res;
    //   })

   
  }
  downloadall(value){
    console.log(value)
    this.commonservice.downloadall(value);
  }
  viewBank(value){
  this.commonservice.getbackendviewbanklist(value).subscribe(res => {
    console.log(res);
    this.fetchData1 = res;
  })
}
}