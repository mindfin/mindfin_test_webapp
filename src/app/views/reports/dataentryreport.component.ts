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
  templateUrl: './dataentryreport.component.html',
})
export class DataentryReportComponent {

  displayedColumns: string[] = ['date','edate', 'cname', 'name','mobile','email','caddress','executive','subvendor','bank','bankvendor', 'displaystatus', 'status','disbuersdate', 'amount','roi','pf','insurance','rejectreason','editby'];
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
  sdate;
  edate;
  ngOnInit() {

  }
  getreport(obj) {
    console.log(obj);
    this.isLoading = true;
    console.log(obj)
    localStorage.setItem("startdate", obj.startdate[0]);
    localStorage.setItem("enddate", obj.startdate[1]);
    this.sdate = localStorage.getItem("startdate");
    this.edate = localStorage.getItem("enddate");
    this.commonservice.getDataentryReportlist(this.postsPerPage, this.currentPage, this.sdate, this.edate);
    this.commonservice
      .getDataentryReportlistDetails()
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
    this.commonservice.getDataentryReportlist(this.postsPerPage, this.currentPage,this.sdate, this.edate);
  }

  data: any;

  demo: any;
  array = [];
  abc: any;
  exportAsXLSX(): void {
    console.log(this.samples);
    let come = this.samples;
    var a;
    const fileName = "Dataentry Report Data";
    for (let i = 0; i < come.length; i++) {
      this.array.push({
        "Applied Date": this.samples[i].applieddate,
        "Edited Date":this.samples[i].editdate,
        "Company Name": this.samples[i].cname,
        "Customer Name": this.samples[i].custname,
        "Mobile": this.samples[i].mobile,
        "Email": this.samples[i].email,
        "Company Address": this.samples[i].caddress,
        "Excecutive Name": this.samples[i].empname,
        "Subvendor Name": this.samples[i].subvendor,
        "Bank Name": this.samples[i].bankname,
        "Bank Vendor": this.samples[i].bankvendor,
        "Customer Status": this.samples[i].displaystatus,
        "Bank Status": this.samples[i].bstatus,
        "Amount": this.samples[i].bamount,
        "Rate Of Intrest": this.samples[i].roi,
        "Processing Fee": this.samples[i].pf,
        "Insurance": this.samples[i].insurance,
        "Bank Reject Reason": this.samples[i].brejectreason,

        
      });
    }
    console.log(this.array);
    this.excelservice.JSONToCSVConvertor(this.array, "Report", true, fileName);
  }
  refresh(): void {
    window.location.reload();
  }
}



