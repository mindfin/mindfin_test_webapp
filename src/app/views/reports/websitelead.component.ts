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
  templateUrl: './websitelead.component.html',
})
export class WebsiteLeadReportComponent {

  displayedColumns: string[] = ['date', 'cname', 'name', 'whosecase', 'executive', 'bank', 'amount', 'product', 'status', 'update', 'createdby', 'disstatus', 'addbank', 'edit'];
  samples: any;
  dataSource;

  constructor(private route: ActivatedRoute, private router: Router,
    private commonservice: CommonService, private service: SuperadminService, private excelservice: SampleService, public dialog: MatDialog) { }
  coins: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  value1: any;
  empid: any;
  empname: any;
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

    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    var emp = { empid: this.empid, empname: this.empname };
    this.commonservice.webleadopenstatus(emp).subscribe(res => {
      console.log(res);
    });

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
    this.commonservice.getWebsiteLead(this.postsPerPage, this.currentPage, this.sdate, this.edate);
    this.commonservice
      .getWebsiteLeadDetails()
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
    this.commonservice.getWebsiteLead(this.postsPerPage, this.currentPage, this.sdate, this.edate);
  }
  onchange(obj) {
    console.log(obj)
    this.value1 = { value: obj, empid: this.empid, empname: this.empname };
    this.commonservice.savecomment(this.value1).subscribe(res => {
      console.log(res);
      this.commonservice.getWebsiteLead(this.postsPerPage, this.currentPage, this.sdate, this.edate);
    });
    // var obj1={obj:obj,period:this.period}
    // console.log(obj1)
    // this.service.addPeriod(obj1).subscribe(res=>{
    //   this.router.navigate(["/members/custstatus/"+ this.idvalue]);

    // });
  }
  data: any;

  demo: any;
  array = [];
  abc: any;
  exportAsXLSX(): void {
    console.log(this.samples);
    let come = this.samples;
    var a;
    const fileName = "Website Lead ";
    for (let i = 0; i < come.length; i++) {
      this.array.push({

        "Applied Date": this.samples[i].applieddate,
        "Company Name": this.samples[i].cname,
        "Customer Name": this.samples[i].name,
        "Mobile No": this.samples[i].mobile,
        "Email Id": this.samples[i].email,
        "Date of Birth": this.samples[i].dob,
        "Pan No": this.samples[i].panno,
        "Pin Code": this.samples[i].pincode,
        "Loan Type": this.samples[i].loantype,
        "Applied Amount": this.samples[i].amount,
        "Display Status": this.samples[i].displaystatus,
        "Status": this.samples[i].status,
        "Comments": this.samples[i].comment,
        "Opened By": this.samples[i].createdbyname,
        "Updated Date": this.samples[i].updateddate,

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



