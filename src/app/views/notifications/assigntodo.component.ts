import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../common.service';
import { DefaultLayoutComponent } from '../../containers';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';



@Component({
  selector: 'app-backend',
  templateUrl: './assigntodo.component.html',
})
export class AssignToDoComponent implements OnInit {
  model: any = {};
  empid: any;
  empname: any;
  title: any;
  desc: any;
  fetchData:any;
  fetchData1:any;
  value;

  constructor(private route: ActivatedRoute, private router: Router,
    private commonservice: CommonService, public defaultlayout: DefaultLayoutComponent, private dialog: MatDialog
  ) { }


  ngOnInit() {
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    console.log(this.empid);
    this.value={empid:this.empid}
    this.commonservice.getToDo(this.value).subscribe(res => {
      console.log(res);
      this.fetchData = res;
    });
  }
  gettodo(todoid){    // this.value1={value:senderid}
    this.commonservice.gettodo1(todoid).subscribe(res=>{
      console.log(res);
      this.fetchData1=res;
    })
  }
  openToDoialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { titel: this.title, desc: this.desc };
    this.dialog.open(CreateToDoDialogContent, dialogConfig
    );
    console.log(dialogConfig);
   
  }
  closetodo(value){
    console.log(value);
    this.commonservice.closetodo(value).subscribe(res => {
      console.log(res);
      this.defaultlayout.ngOnInit();
      this.ngOnInit();
    });
  }

  refresh(): void {
    window.location.reload();
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'createtodo_dialog.html',
})

export class CreateToDoDialogContent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private commonservice: CommonService, private route: ActivatedRoute, private router: Router,
    public dialogRef: MatDialogRef<CreateToDoDialogContent>) { }

  element: any;
  empid: any;
  empname: any;
  value1: any;
  model: any;
  onSubmit(data) {
    console.log(data);
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    this.value1 = { value: data, empid: this.empid, empname: this.empname }
    this.commonservice.addToDo(this.value1)
      .subscribe(res => {
        this.dialogRef.close();
        this.refresh();
      })
  }

  refresh(): void {
    window.location.reload();
  }
}

