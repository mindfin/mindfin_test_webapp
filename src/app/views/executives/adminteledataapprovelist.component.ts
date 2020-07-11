import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { SuperadminService } from '../../superadmin.service';

import { PageEvent, MatTableDataSource, MatSort, MatPaginator, MatDialogRef } from '@angular/material';
import { SampleService } from '../../sample.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { DefaultLayoutComponent } from '../../containers';

// export interface DialogData {
// this.model;
// }


@Component({
  selector: 'app-home',
  templateUrl: './adminteledataapprovelist.component.html',
})
export class AdminTeledataApprovelistComponent {

  displayedColumns: string[] = ['date', 'id', 'name','redate', 'mobile', 'email', 'address', 'bankname', 'bank', 'telename', 'comment',  'edit', 'assign'];
  samples: any;
  dataSource;

  constructor(private route: ActivatedRoute, private router: Router,
    private commonservice: CommonService, private service: SuperadminService,
    private excelservice: SampleService, public dialog: MatDialog,
    public defaultlayout: DefaultLayoutComponent) { }
  coins: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  fetchData: any;
  model: any = {};
  aa: any;
  // posts:Memberlist[] = [];
  totalPosts = 0;
  postsPerPage = 500;
  currentPage = 1;
  pageSizeOptions = [500, 800, 1000];
  isLoading = false;
  emp = 2;
  idvalue;
  exeid: any;
  array = [];
  sdate: any;
  edate: any;
  empid: any;
  empname: any;
  value1:any;
  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      // console.log(params['id']);
      this.exeid = localStorage.getItem("id");
      // this.idvalue = params['id'];
      this.commonservice.getEnquiryApprovelistexe(this.postsPerPage, this.currentPage, this.exeid);
      this.commonservice
        .getEnquiryApprovelistexeDetails()
        .subscribe((postData: { posts: SuperadminService[], postCount: number }) => {

          this.totalPosts = postData.postCount;
          this.dataSource = new MatTableDataSource(postData.posts);
          // this.dataSource = new (postData.posts);
          this.samples = postData.posts;
          this.isLoading = false;
          console.log(postData.posts);
          // console.log(postData.postCount);     
          this.dataSource.sort = this.sort;
          // console.log(this.dataSource.sort);
        });
    });
    this.commonservice.getemailSettings().subscribe(res=>{
      console.log(res);
      this.fetchData =res;

    })
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
    this.commonservice.getEnquiryApprovelistexe(this.postsPerPage, this.currentPage, this.exeid);
  }

  refresh(): void {
    window.location.reload();
  }
  
  exportAsXLSX(): void {
    console.log(this.samples);
    let come = this.samples;
    var a;

    const fileName = "Enquired Approved Data";
    for (let i = 0; i < come.length; i++) {
      this.array.push({

        "Enquired Date": this.samples[i].createddate,
        "Reminded Date ": this.samples[i].remindDate,
      "Updated On": this.samples[i].opt,
        "Company Name/Customer Name": this.samples[i].name,
        "Mobile": this.samples[i].mobile,
        "EmailId": this.samples[i].email,
        "Address": this.samples[i].address,
        "Loantype": this.samples[i].loantype,
        "Alternate Number": this.samples[i].altmobile,
        "Status": this.samples[i].status,
        "Branch": this.samples[i].branch,
        "Tellecaller Name": this.samples[i].empname,
        "Comments": this.samples[i].comment,
        "Turnover": this.samples[i].turnover,
        // "Executive Name": this.samples[i].executivename,

      });
    }
    console.log(this.array);
    this.excelservice.JSONToCSVConvertor(this.array, "Report", true, fileName);
  }

  notify(obj) {
    console.log(obj);
    this.value1={value:obj, emails:this.fetchData}
    this.commonservice.notify(this.value1).subscribe(res=>{
      console.log(res);
      alert("Reminder sent Successfully");
     this.ngOnInit();

    })
  }
  removeCase(obj) {
    console.log(obj);
    this.value1={value:obj, emails:this.fetchData}
    this.commonservice.removeCase(this.value1).subscribe(res=>{
      console.log(res);
      alert("Case Removed Successfully");
      this.openDialog(obj)

    })
  }
  // getreport(obj) {

  //   // this.commonservice.gettelereport(obj).subscribe(res=>{
  //   //   console.log(res);
  //   // })
  //   console.log(obj);
  //   this.isLoading = true;
  //   console.log(obj)
  //   localStorage.setItem("startdate", obj.startdate[0]);
  //   localStorage.setItem("enddate", obj.startdate[1]);
  //   this.sdate = localStorage.getItem("startdate");
  //   this.edate = localStorage.getItem("enddate");
  //   this.commonservice.getDataEnquirylist1(this.postsPerPage, this.currentPage, this.sdate, this.edate, this.exeid);
  //   this.commonservice
  //     .getDataEnquirylistDetails1()
  //     .subscribe((postData: { posts: SuperadminService[], postCount: number }) => {

  //       this.totalPosts = postData.postCount;
  //       this.dataSource = new MatTableDataSource(postData.posts);
  //       // this.dataSource = new (postData.posts);
  //       this.samples = postData.posts;
  //       this.isLoading = false;
  //       console.log(postData.posts);
  //       console.log(postData.postCount);
  //       this.dataSource.sort = this.sort;
  //       console.log(this.dataSource.sort);
  //     })
  // }

  openDialog(element) {
    this.model=element;
    
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {element};
      this.dialog.open(AssignDialogContent1,dialogConfig
    );
    console.log(dialogConfig );
    
    }
  }
  
  @Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'assignexe-content.html',
  })
  
  export class AssignDialogContent1{ 
  
  
    constructor(@Inject(MAT_DIALOG_DATA) public data:any,
    private commonservice: CommonService ,private route: ActivatedRoute, private router: Router,
    public dialogRef: MatDialogRef<AssignDialogContent1>) {}
  element:any;
  //   constructor(
  //     @Inject(MAT_DIALOG_DATA) public data: any
  //  ) { }
  @ViewChild(MatSort) sort: MatSort;
  fetchData:any;
  fetchData1:any;
  exeid;
  totalPosts = 0;
  postsPerPage = 500;
  currentPage = 1;
  pageSizeOptions = [ 500, 800, 1000];
  isLoading = false;
  dataSource;
  samples:any;
  value1:any;
  ngOnInit() {
     this.commonservice.getemailSettings().subscribe(res=>{
        console.log(res);
        this.fetchData =res;
  
      })
    this.commonservice.getexecutivelist().subscribe(res => {
      console.log(res);
      this.fetchData1 = res;
    });
  }
  assignexe(obj){
     console.log(obj);
    //  console.log(obj1);
    this.value1={value:obj, emails:this.fetchData}
    this.commonservice.assignexe(this.value1).subscribe(res => {
      console.log(res);
      this.dialogRef.close();
  
      this.exeid=localStorage.getItem("id");
      // this.idvalue = params['id'];
      this.commonservice.getEnquiryApprovelistexe(this.postsPerPage, this.currentPage,this.exeid);
      this.commonservice
      .getEnquiryApprovelistexeDetails()
       .subscribe((postData: {posts: SuperadminService[], postCount: number})=> {
        
          this.totalPosts = postData.postCount;
          this.dataSource = new MatTableDataSource(postData.posts);
          // this.dataSource = new (postData.posts);
          this.samples = postData.posts;
          this.isLoading = false;
        // console.log(postData.posts);
        // console.log(postData.postCount);     
        this.dataSource.sort = this.sort;
      // console.log(this.dataSource.sort);
      });
    });
    
   }
   refresh(): void {
    window.location.reload();
  }
  }

