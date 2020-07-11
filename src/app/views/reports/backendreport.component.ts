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
  templateUrl: './backendreport.component.html',
})
export class BackendReportComponent {

  displayedColumns: string[] = ['date', 'cname', 'name', 'whosecase', 'executive', 'bank', 'amount', 'product', 'status', 'update','createdby','addbank','addstatus'];
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
  pageSizeOptions = [300, 500, 1000];
  currentPage = 1;
  isLoading = false;
  emp = 2;
  teleid: any;
  sdate;
  edate;
  ngOnInit() {


  }
  getreport(obj) {

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
    this.commonservice.getBackendlist(this.postsPerPage, this.currentPage, this.sdate, this.edate);
    this.commonservice
      .getBackendlistDetails()
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
    this.commonservice.getBackendlist(this.postsPerPage, this.currentPage, this.sdate, this.edate);
  }

  data: any;

  demo: any;
  array = [];
  abc: any;
  exportAsXLSX(): void {
    console.log(this.samples);
    let come = this.samples;
    var a;
    const fileName = "Backend Status ";
    for (let i = 0; i < come.length; i++) {
      this.array.push({

        "Created Date": this.samples[i].acreateddate,
        "Company Name": this.samples[i].cname,
        "Customer Name":this.samples[i].name,
        "Whose Case": this.samples[i].whosecase,
        "Excecutive Name": this.samples[i].aexecutivename,
        "Bank Name": this.samples[i].bankname,
        "Applied Amount": this.samples[i].aamount,
        "Product": this.samples[i].product,
        "Status": this.samples[i].astatus,
        "Comments": this.samples[i].scomment,
        "Created By": this.samples[i].ccreatedbyname,
        "Bank Added By": this.samples[i].acreatedbyname,
        "Status Edited By": this.samples[i].screatedbyname,

      });
    }
    console.log(this.array);


    // console.log(this.array);   
    this.excelservice.JSONToCSVConvertor(this.array, "Report", true, fileName);


  }

  refresh(): void {
    window.location.reload();
  }




}



