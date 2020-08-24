import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';
import { isNumeric } from 'rxjs/util/isNumeric';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


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

  constructor(private service: SuperadminService, private router: Router, private commonservice: CommonService,private dialog: MatDialog) { }

  model: any = {};
  fetchData;
  fetchData1;


  ngOnInit() {

  }
  refresh() {
    window.location.reload();
  }
  checkcase(obj) {
    var value = obj.checkno
    console.log(obj);
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
      else {
      console.log(res);
      this.custid = res[0].idcustomer;
      this.fetchData = res[0];
      }
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
  share(element) {
    this.model=element;
    
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {element};
      this.dialog.open(ShareFileDialog,dialogConfig
    );
    console.log(dialogConfig );
    
    }
  downloadall(value){
    console.log(value)
    this.commonservice.downloadall(value);
  }
}
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'sharefiledialog.html',
})

export class ShareFileDialog{ 


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private commonservice: CommonService ,private route: ActivatedRoute, private router: Router,
  public dialogRef: MatDialogRef<ShareFileDialog>) {}
  element:any;
  empid;
  empname;
  fetchData:any;
  value;
  fetchData2:any;  
  fetchData4:any;  
  tempval: any;
  array: any = [];
  idvalue:any;
  vvv:any;

  ngOnInit() {
    this.commonservice.getemployee().subscribe(res => {
      console.log(res)
      this.fetchData=res;
      this.commonservice.getemailSettings().subscribe(res=>{
        console.log(res);
        this.fetchData4 =res;
  
      })
      
});

  }
  addvalues() {
    console.log(this.data.element.employeename),
    console.log(this.data.element.Filename)
    var abc = this.data.element.employeename.split(",", 3);
    var def = this.data.element.Filename.split(",", 2);
  
    this.array.push({
      fileName: def[1],
      OSSName:def[0],
      requesterid: abc[0],
      requesteraName: abc[1],
      requesteraemail: abc[2],
      comment:this.data.element.comment,
      companyName:this.data.element.cname,
  
    })
    console.log(this.array);
    this.tempval = this.array;
  
  }
  removevalue(pro,index){
    console.log(index);
    this.array.splice(index,1);
  
  }
// onSubmit(obj){
//   var obj2={obj:obj}
//   console.log(obj2)
//   this.commonservice.addPeriod(obj2).subscribe(res=>{
//     alert("Tenure Added Successfully");
//   this.dialogRef.close();
//     })
//  }
submitForm() {
  console.log(this.array);
  this.empid = localStorage.getItem("id");
this.empname=localStorage.getItem("empname")
  this.vvv = {
    arr: this.array,
  empID: this.empid,
  empName:this.empname,
  emails:this.fetchData4
  }
  this.commonservice.shareFile(this.vvv).subscribe(res=>{
        alert("File Shared Successfully");
      this.dialogRef.close();
        })
}
 refresh(): void {
  window.location.reload();
}
}