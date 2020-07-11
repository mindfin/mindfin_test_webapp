import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


export interface User {
  name: string;
}
@Component({
  templateUrl: './checkcase.component.html',
})

export class CheckCaseComponent {
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

  constructor(private service: SuperadminService, private router: Router, private commonservice: CommonService,private dialog: MatDialog) { }

  model: any = {};
  fetchData:any;
  fetchData1:any;


  ngOnInit() {

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
      this.custid = res[0].idcustomer;
      this.fetchData=res[0]; 
    })
      // this.commonservice.backendeditemp(this.custid).subscribe(res=>{
      //   console.log(res);
      //   this.fetchData=res;
      //   })
    
        this.commonservice.getbackendviewbanklist(this.custid).subscribe(res=>{
            console.log(res);
            this.fetchData1=res;
            })   
  
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
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'editstatusdialog-contentnew.html',
})

export class EditDialogContent1{ 


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private commonservice: CommonService ,private route: ActivatedRoute, private router: Router,
  public dialogRef: MatDialogRef<EditDialogContent1>) {}
element:any;
empid;
empname;
value;

onSubmit(obj,obj1){
  this.empid = localStorage.getItem("id");
  this.empname = localStorage.getItem("empname");
   console.log(obj);
   console.log(obj1);
   this.value = {obj:obj,empid:this.empid,empname:this.empname}
  this.commonservice.editstatus(this.value)
  .subscribe(res => {
    alert("Bank Updated Successfully");
  this.dialogRef.close();
  })
 }
 refresh(): void {
  window.location.reload();
}
}