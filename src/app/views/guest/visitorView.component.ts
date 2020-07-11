import { Component, OnInit,ViewChild,Inject, NgModule} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { SuperadminService } from '../../superadmin.service';
// import { CommonService } from '../../superadmin.service';

import { PageEvent, MatTableDataSource, MatSort, MatPaginator, MatDialogRef } from '@angular/material';
// import { Memberlist } from '../../../../models/booking.model';
import { SampleService } from '../../sample.service';
import {MatDialog,MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material';
import { DefaultLayoutComponent } from '../../containers';

// export interface DialogData {
// this.model;
// }


@Component({
  selector: 'app-home',
  templateUrl: './visitorView.component.html',
})
export class VisitorViewComponent  {
 
  displayedColumns: string[] = ['date','name','photo','meetwhom', 'visitReason', 'noofvisitor','view','response'];
  samples: any;
  dataSource;
  constructor(private route: ActivatedRoute, private router: Router,
    private commonservice: CommonService, private service: SuperadminService,
     private excelservice: SampleService, public dialog: MatDialog,
     public defaultlayout: DefaultLayoutComponent) { }
  coins: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  fetchdata: any;
  model: any = {};
  aa: any;
  // posts:Memberlist[] = [];
  totalPosts = 0;
  postsPerPage = 100;
  currentPage = 1;
  pageSizeOptions = [100, 300, 500];
  isLoading = false;
  emp = 2;
  empid;
  empname;
  ngOnInit() {
    
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    var emp= {empid: this.empid, empname: this.empname };
    this.commonservice.visitoropenstatus(emp).subscribe(res=>{
      this.defaultlayout.ngOnInit();
      console.log(res);
     });
    this.isLoading = true;
    this.commonservice.getAllVisitors(this.postsPerPage, this.currentPage);
    this.commonservice
      .getAllVisitorsDetails()
      .subscribe((postData: { posts: SuperadminService[], postCount: number }) => {

        this.totalPosts = postData.postCount;
        this.dataSource = new MatTableDataSource(postData.posts);
        // this.dataSource = new (postData.posts);
        this.samples = postData.posts;
        this.isLoading = false;
        console.log(postData.posts);
        console.log(postData.postCount);
        this.dataSource.sort = this.sort;
        console.log(this.dataSource.sort);
      });


  }
  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    console.log(this.postsPerPage);
    this.commonservice.getAllVisitors(this.postsPerPage, this.currentPage);
  }

  data: any;
  demo: any;
  array = [];
  abc: any;
  
  refresh(): void {
    window.location.reload();
  }
  exportAsXLSX(): void {
    console.log(this.samples);
    let come = this.samples;
    var a;
    const fileName = "Visitor's"; 
    for (let i = 0; i < come.length; i++) {
      this.array.push({
         "Created Date": this.samples[i].createdDate,
        "Visitor  Name":this.samples[i].visitorName,
        "Company Name": this.samples[i].organizationName,
        "Email ID": this.samples[i].emailId,
        "Gender": this.samples[i].gender,
        "Mobile Number": this.samples[i].mobileNumber,
        "Alter Number": this.samples[i].alternativeNumber,
        "Address": this.samples[i].address,
        "No OF Visitors": this.samples[i].numberOfVisitors,
        "Visit Reason": this.samples[i].visitReason,
        "Reference Name": this.samples[i].referenceName,
        "Meet Whom": this.samples[i].toMeetWhom,
        "Existing Appointment": this.samples[i].existingAppointment,
        "Response": this.samples[i].response,
      });
    }
    console.log(this.array);
    // console.log(this.array);   
    this.excelservice.JSONToCSVConvertor(this.array, "Report", true, fileName);
  }
  openDialog(element) {
    this.model=element;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {element};
    this.dialog.open(ViewVisitorDialogContent,dialogConfig);
    console.log(dialogConfig );
  }
  openResponseDialog(element) {
    this.model=element;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {element};
    this.dialog.open(VisitorResponseDialogContent,dialogConfig);
    console.log(dialogConfig );
  }
 
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'viewVisitor_dialog.html',
})

export class ViewVisitorDialogContent{ 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any) {}
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'responseVisitor_dialog.html',
}) 
export class VisitorResponseDialogContent{ 
 

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private commonservice: CommonService, private route: ActivatedRoute, private router: Router,
  public dialogRef: MatDialogRef<VisitorResponseDialogContent>) {}
  element: any;
  empid: any;
  empname: any;
  value1: any;
  
  fetchData:any;
  ngOnInit() {
    this.commonservice.getemailSettings().subscribe(res=>{
      console.log(res);
      this.fetchData =res;

    })
  }
  onSubmit(value) {
    console.log(value);
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    this.value1 = { value: value, empid: this.empid, empname: this.empname,emails:this.fetchData };
    console.log(this.value1);
    this.commonservice.respondVisitor(this.value1)
      .subscribe(res => {
        alert("Successfully Responded");
        this.redirect();
        this.dialogRef.close();
        
      })
  }
  refresh(): void {
    window.location.reload();
  }
  redirect(){
    this.router.navigate(["/guest/viewVisitor"]);
  }
}
