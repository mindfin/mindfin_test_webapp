import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { SuperadminService } from '../../superadmin.service';

import { PageEvent, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SampleService } from '../../sample.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';

// export interface DialogData {
// this.model;
// }


@Component({
  selector: 'app-home',
  templateUrl: './datatelelist.component.html',
})
export class DatatelelistComponent {

  displayedColumns: string[] = ['date', 'id', 'name', 'address', 'mobile', 'email', 'bankname','turnover', 'comment', 'empname', 'branch','exename'];
  samples: any;
  dataSource;

  constructor(private route: ActivatedRoute, private router: Router,
    private commonservice: CommonService, private service: SuperadminService, private excelservice: SampleService, public dialog: MatDialog) { }
  coins: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  fetchdata: any;
  model: any = {};
  aa: any;
  // posts:Memberlist[] = [];
  totalPosts = 0;
  postsPerPage = 300;
  currentPage = 1;
  pageSizeOptions = [300, 500, 1000];
  isLoading = false;
  emp = 2;
  teleid: any;
  sdate: any;
  edate: any;
  ngOnInit() {


    // this.isLoading = true;
    // this.teleid = localStorage.getItem("id");
    // this.commonservice.getDataEnquirylist(this.postsPerPage, this.currentPage);
    // this.commonservice
    // .getDataEnquirylistDetails()
    //  .subscribe((postData: {posts: SuperadminService[], postCount: number})=> {

    //     this.totalPosts = postData.postCount;
    //     this.dataSource = new MatTableDataSource(postData.posts);
    //     // this.dataSource = new (postData.posts);
    //     this.samples = postData.posts;
    //     this.isLoading = false;
    //   console.log(postData.posts);
    //   console.log(postData.postCount);     
    //   this.dataSource.sort = this.sort;
    // console.log(this.dataSource.sort);
    // });


  }
  gettelereport(obj) {

    // this.commonservice.gettelereport(obj).subscribe(res=>{
    //   console.log(res);
    // })
    console.log(obj);
    this.isLoading = true;
    console.log(obj)
    localStorage.setItem("startdate", obj.startdate[0]);
    localStorage.setItem("enddate", obj.startdate[1]);
    this.sdate = localStorage.getItem("startdate");
    this.edate = localStorage.getItem("enddate");
    this.commonservice.getDataEnquirylist(this.postsPerPage, this.currentPage, this.sdate, this.edate);
    this.commonservice
      .getDataEnquirylistDetails()
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


  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    console.log(this.postsPerPage);
    this.commonservice.getDataEnquirylist(this.postsPerPage, this.currentPage, this.sdate, this.edate);
  }

  data: any;

  demo: any;
  array = [];
  abc: any;
  exportAsXLSX(): void {
    console.log(this.samples);
    let come = this.samples;
    var a;
    const fileName = "Telecaller Data ";
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

      });
    }
    console.log(this.array);


    // console.log(this.array);   
    this.excelservice.JSONToCSVConvertor(this.array, "Report", true, fileName);


  }

  rejectmember(element) {
    this.service.rejectmember(element);
  }

  viewbank(element) {
    this.commonservice.viewbank(element);
  }
  editmember(element) {
    console.log(element);
  }

  addbank(id) {
    this.commonservice.addbank(id);

  }
  refresh(): void {
    window.location.reload();
  }



}



