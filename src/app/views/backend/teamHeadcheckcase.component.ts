import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EditDialogContent1 } from './checkcase.component';
import { isNumeric } from 'rxjs/util/isNumeric';

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
  custid: any;
  reqfile: any;
  model: any = {};
  fetchData: any;
  fetchData1: any;
  fetchData2: any;
  fetchData3: any;
  fetchData4: any;
  fetchData5: any;
  fetchData6: any;
  fetchData7: any;
  display: any;
  addBankCustId: any;
  empid:any;
  empname:any;
  vvv:any;

  constructor(private service: SuperadminService, private router: Router, private commonservice: CommonService, private dialog: MatDialog) { }
  ngOnInit() {
    this.commonservice.getemailSettings().subscribe(res => {
      console.log(res);
      this.fetchData4 = res;
    })
    this.commonservice.getloanlist().subscribe(res => {
      console.log(res);
      this.fetchData5 = res;
    });
    this.commonservice.getbanklist().subscribe(res => {
      console.log(res);
      this.fetchData6 = res;
    });
    this.commonservice.getallexecutivelist().subscribe(res => {
      console.log(res);
      this.fetchData7 = res;
    });
  }
  editcustomer(id) {
    console.log(id);
    this.commonservice.editcustomer(id);
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
         
        }
        else { alert("Sorry ! " + value + " Customer details are not found. Try Other Option to check customer exist or not.") }
       
      }
      else {
        this.custid = res[0].idcustomer;
        this.fetchData = res[0];
        this.commonservice.getbackendviewbanklist(this.custid).subscribe(res1 => {
          console.log(res1);
          if (res1 == null || res1 == undefined || res1 == 0) {
            alert("Sorry there are no bank assigned to this Customer")
          }
          else {
            this.fetchData1 = res1;
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
    this.model = element;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { element };
    this.dialog.open(EditDialogContent1, dialogConfig
    );
    console.log(dialogConfig);

  }
  addtenure(element) {
    var result: any;
    console.log("hii")
    this.commonservice.getviewbanklistt(element).subscribe(res => {
      console.log(res);
      // this.fetchData2 = res;

      // result=this.fetchData2;
      console.log(res)
      this.model = res[0];
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = this.model;
      this.dialog.open(AddTenureDialogContent, dialogConfig

      );
      console.log(dialogConfig);
    });


  }
  request(file, data) {
    console.log(file)
    if (file == null || file == undefined || file == 0) {
      this.reqfile = "All File"
    }
    else {
      this.reqfile = file;
    }
    var name = localStorage.getItem("empname");
    var id = localStorage.getItem("id");
    var email = localStorage.getItem("email");
    var value = { File: this.reqfile, Data: data, empname: name, empid: id, email: email, emails: this.fetchData4 };
    this.commonservice.request(value)
      .subscribe(res => {
        alert(this.reqfile + " Download request sent successfully");
      })

  }
  addbankshow() {
    this.addBankCustId = 'true';
  }
  addbankhide(){
    this.addBankCustId='false'
  }
  getbanklist() {
    this.commonservice.getbackendviewbanklist(this.custid).subscribe(res1 => {
      console.log(res1);
      if (res1 == null || res1 == undefined || res1 == 0) {
        alert("Sorry there are no bank assigned to this Customer")
      }
      else {
        this.fetchData1 = res1;
      }
    })
  }
  clearFilters() {
    this.model.idbank = '';
    this.model.amount = '';
    this.model.status = '';
    this.model.product = '';
    this.model.executiveid = '';
    this.model.previousapplytype = '';
  }
  addvalues() {
    console.log(this.model.idbank);
    console.log(this.model.executiveid)
    console.log(this.fetchData);
    var abc = this.model.idbank.split(",", 3);
    var abc1 = this.model.executiveid.split(",", 2);
    var def = this.model.previousapplytype.split(",", 2);

    this.array.push({
      amount: this.model.amount,
      bankname: abc[1],
      bankid: abc[0],
      vendor: abc[2],
      status: this.model.status,
      product: this.model.product,
      executiveid: abc1[0],
      executivename: abc1[1],
      previousapplytype: def[1],
      loanid: def[0]

    })
    console.log(this.array);
    this.tempval = this.array;

  }
  removevalue(pro, index) {
    console.log(index);
    this.array.splice(index, 1);

  }
  submitForm() {
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    console.log(this.array);
    this.vvv = {
      arr: this.array,
      idvalue: this.custid,
      empid: this.empid,
      createdbyname: this.empname,
    }
    this.commonservice.backendbankinsert(this.vvv).subscribe(res=>{
      alert("Bank Added Successfully")
      this.addbankhide();
      this.getbanklist()
     })
  }


}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'addtenuredialog.html',
})

export class AddTenureDialogContent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private commonservice: CommonService, private route: ActivatedRoute, private router: Router,
    public dialogRef: MatDialogRef<AddTenureDialogContent>) { }
  element: any;
  empid;
  empname;
  value;
  period: any;
  fetchData2: any;
  ngOnInit() {
    this.commonservice.getPeriod().subscribe(res => {
      console.log(res);
      this.fetchData2 = res;
    });
  }
  getperiod(obj) {
    this.period = obj;
    console.log(obj);
  }
  onSubmit(obj) {
    var obj2 = { obj: obj, period: this.period }
    console.log(obj2)
    this.commonservice.addPeriod(obj2).subscribe(res => {
      alert("Details Added Successfully");
      this.dialogRef.close();
    })
  }
  refresh(): void {
    window.location.reload();
  }
}