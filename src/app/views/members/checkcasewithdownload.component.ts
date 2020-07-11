import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';


export interface User { 
  name: string;
}
@Component({
  templateUrl: './checkcasewithdownload.component.html',
})

export class CheckCaseDownloadComponent {
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
      this.custid = res[0].idcustomer;
      this.fetchData = res[0];
    })
    // this.commonservice.backendeditemp(this.custid).subscribe(res=>{
    //   console.log(res);
    //   this.fetchData=res;
    //   })

    // this.commonservice.getbackendviewbanklist(this.custid).subscribe(res => {
    //   console.log(res);
    //   this.fetchData1 = res;
    // })
  }
  downloadall(value){
    console.log(value)
    this.commonservice.downloadall(value);
  }
}