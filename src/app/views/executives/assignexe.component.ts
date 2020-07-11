import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { SuperadminService } from '../../superadmin.service';

import { PageEvent, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SampleService } from '../../sample.service';
import {MatDialog,MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material';

// export interface DialogData {
// this.model;
// }


@Component({
  selector: 'app-home',
  templateUrl: './assignexe.component.html',
})
export class AssignExeComponent  {

  displayedColumns: string[] = ['date','id','name','mobile','email','address','bankname','telename','comment','turnover','edit','assign'];
  samples:any;
  dataSource;

  constructor(private route:ActivatedRoute, private router:Router,
    private commonservice:CommonService, private service:SuperadminService,private excelservice:SampleService,public dialog: MatDialog) { }
    coins:any;
   @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

  
fetchdata:any;
model:any = {};
aa:any;
// posts:Memberlist[] = [];
totalPosts = 0;
postsPerPage = 500;
currentPage = 1;
pageSizeOptions = [ 500, 800, 1000];
isLoading = false;
emp = 2;
idvalue;
exeid:any;
array:any;
sdate:any;
edate:any;
  ngOnInit() {
    this.isLoading = true;  
    this.route.params.subscribe(params=>{
      // console.log(params['id']);
      this.exeid=localStorage.getItem("id");
      // this.idvalue = params['id'];
      this.commonservice.getEnquirylistexe1(this.postsPerPage, this.currentPage,this.exeid);
      this.commonservice
      .getEnquirylistexeDetails1()
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

  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    console.log(this.postsPerPage);
    this.commonservice.getEnquirylistexe1(this.postsPerPage, this.currentPage,this.exeid);
  }

refresh(): void {
  window.location.reload();
}
exportAsXLSX(): void {
  console.log(this.samples);
  let come = this.samples;
  var a;
  const fileName = "Enquired Data";
  for (let i = 0; i < come.length; i++) {
    this.array.push({

      "Enquired Date": this.samples[i].createddate,
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
      "Executive Name": this.samples[i].executivename,
      "Assigned On":this.samples[i].assignedTime,

    });
  }
  console.log(this.array);


  // console.log(this.array);   
  this.excelservice.JSONToCSVConvertor(this.array, "Report", true, fileName);


}

editData(id){
  console.log(id);
  this.commonservice.teleeditData(id);
}
getreport(obj) {

  // this.commonservice.gettelereport(obj).subscribe(res=>{
  //   console.log(res);
  // })
  console.log(obj);
  this.isLoading = true;
  console.log(obj)
  localStorage.setItem("startdate", obj.startdate);
  localStorage.setItem("enddate", obj.enddate);
  this.sdate = localStorage.getItem("startdate");
  this.edate = localStorage.getItem("enddate");
  this.commonservice.getDataEnquirylist1(this.postsPerPage, this.currentPage, this.sdate, this.edate,this.exeid);
  this.commonservice
    .getDataEnquirylistDetails1()
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
    })
}
}


