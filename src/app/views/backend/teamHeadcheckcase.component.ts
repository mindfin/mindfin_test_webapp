import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EditDialogContent1 } from './checkcase.component';


export interface User {
  name: string;
}
@Component({
  templateUrl: './teamHeadcheckcase.component.html',
})

export class TeamHeadCheckCaseComponent {
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

  constructor(private service: SuperadminService, private router: Router, private commonservice: CommonService,private dialog: MatDialog) { }

  model: any = {};
  // model1: any = {};
  fetchData:any;
  fetchData1:any;
  fetchData2:any;
  fetchData3:any;
  fetchData4:any;
display:any;
  
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
  checkcase(obj) {
  
    console.log(obj);
    // var idno=obj.idno;
    this.commonservice.checkcase(obj).subscribe(res => {
      console.log(res);
      if (res == null || res == undefined || res == 0) {
        alert("Sorry ! "+obj.checkno+" this Customer details are not found. Try Other Option to check customer exist or not.")
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
    addtenure(element){
    var result:any;
      console.log("hii")
      this.commonservice.getviewbanklistt(element).subscribe(res=>{
        console.log(res);
        // this.fetchData2 = res;
     
      // result=this.fetchData2;
      console.log(res)
      this.model=res[0];
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = this.model;
      this.dialog.open(AddTenureDialogContent,dialogConfig
        
    );
    console.log(dialogConfig );
  });
    
    
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
      
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'addtenuredialog.html',
})

export class AddTenureDialogContent{ 


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private commonservice: CommonService ,private route: ActivatedRoute, private router: Router,
  public dialogRef: MatDialogRef<AddTenureDialogContent>) {}
  element:any;
  empid;
  empname;
  value;
  period:any;
  fetchData2:any;
  ngOnInit() {
  this.commonservice.getPeriod().subscribe(res=>{
    console.log(res);
    this.fetchData2 = res;
  });  
}
getperiod(obj){
  this.period=obj;
console.log(obj);
}
onSubmit(obj){
  var obj2={obj:obj,period:this.period}
  console.log(obj2)
  this.commonservice.addPeriod(obj2).subscribe(res=>{
    alert("Tenure Added Successfully");
  this.dialogRef.close();
    })
 }
 refresh(): void {
  window.location.reload();
}
}