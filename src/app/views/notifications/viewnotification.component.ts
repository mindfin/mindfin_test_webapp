import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../common.service';
import { DefaultLayoutComponent } from '../../containers';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-backend',
  templateUrl: './viewnotification.component.html',
})
export class ViewNotificationComponent implements OnInit {
  model: any = {};
  model1: any = {};
  empid: any;
  empname: any;
  fetchData: any;
  fetchData1: any;
  value1:any;
  searchText:any;
  constructor(private route: ActivatedRoute, private router: Router,
    private commonservice: CommonService, public defaultlayout: DefaultLayoutComponent,
    private dialog: MatDialog
  ) { }
  isCollapsed: boolean = false;


  ngOnInit() {
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");

    this.commonservice.getGroupNotification().subscribe(res => {
      console.log(res);
      this.fetchData = res;
    });

  }

  openDeleteDialog(value) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id: value };
    this.dialog.open(DeleteNotificationDialogContent, dialogConfig
    );
    console.log(dialogConfig);

  }
  openSeenByDialog(value) {

    console.log(value);
    this.commonservice.openSeenByDialog(value);

  }
  getnotification(senderid){
    // this.value1={value:senderid,empid:this.empid}
    this.commonservice.getAllNotificationById(senderid).subscribe(res=>{
      console.log(res);
      this.fetchData1=res;
    })
  }
  
  refresh(): void {
    window.location.reload();
  }

}
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'deletenotification_dialog.html',
})

export class DeleteNotificationDialogContent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private commonservice: CommonService, private route: ActivatedRoute, private router: Router,
    public dialogRef: MatDialogRef<DeleteNotificationDialogContent>) { }

  element: any;
  empid: any;
  empname: any;
  value1: any;
  model: any;
  onSubmit(data) {
    console.log(data);

    this.commonservice.deleteNotification(data)
      .subscribe(res => {
        this.dialogRef.close();
        this. refresh();
      })
  }
  close(){
    this.dialogRef.close();
  }
  refresh(): void {
    window.location.reload();
  }
}

