import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EditDialogContent1 } from '../backend/checkcase.component';

import { isNumeric } from 'rxjs/util/isNumeric';

export interface User {
  name: string;
}
@Component({
  templateUrl: './dataentrycheckcase.component.html',
})

export class DataEnterCheckCaseComponent {
  myControl = new FormControl();
  val: any = [];
  selectedFile: File = null;
  selectedFile1: File = null;
  selectedFile2: File = null;

  tempval: any;
  tempval1: any;
  array: any = [];
  array1: any = [];
custid:any;
reqfile:any;
fetchData4:any;
  constructor(private service: SuperadminService, private router: Router, private commonservice: CommonService,private dialog: MatDialog) { }

  model: any = {};
  fetchData:any;
  fetchData1:any;


  ngOnInit() {
    this.commonservice.getemailSettings().subscribe(res=>{
      console.log(res);
      this.fetchData4 =res;

    })
  }
  editcustomer(id){
    console.log(id);
    this.commonservice.editcustomer(id);
  }
  refresh() {
    window.location.reload();
  }
  request(file,data){ 
    console.log(file)
    if(file == null || file == undefined || file == 0){
    this.reqfile="All File"
    }
    else{
      this.reqfile=file;
    }
  var name = localStorage.getItem("empname");
  var email = localStorage.getItem("email");
  var  value = { File: this.reqfile,Data:data, empname: name, email: email,emails:this.fetchData4};
  this.commonservice.request(value)
    .subscribe(res => {
      alert(this.reqfile+" Download request sent successfully");
    })
  
  }
  checkcase(obj) {
  
    console.log(obj);
    var value = obj.checkno

    // var idno=obj.idno;
    this.commonservice.checkcase(obj).subscribe(res => {
      console.log(res);
      if (res == null || res == undefined || res == 0) {
        if (isNumeric(value)) {
          alert("Sorry ! " + value + " this Customer details are not found. Try Other Option to check customer exist or not.")
          this.fetchData=''
        }
        else { alert("Sorry ! " + value + " Customer details are not found. Try Other Option to check customer exist or not.") }
        this.fetchData=''
     
    }
      else{
        this.custid = res[0].idcustomer;
        this.fetchData=res[0]; 
        this.commonservice.getbackendviewbanklist(this.custid).subscribe(res1=>{
          console.log(res1);
          if (res1 == null || res1 == undefined || res1 == 0) {
            alert("Sorry there are no bank assigned to this Customer")
            }
            else{
          this.fetchData1=res1;
            }
          })
      }
    })
      // this.commonservice.backendeditemp(this.custid).subscribe(res=>{
      //   console.log(res);
      //   this.fetchData=res;
      //   })
    
         
          }
  openDialog(element) {
    this.model=element;
    
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {element};
      this.dialog.open(EditDialogContent1,dialogConfig
    );
    console.log(dialogConfig );
    
    }
}
