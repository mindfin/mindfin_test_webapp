import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { SuperadminService } from '../../superadmin.service';

import { PageEvent, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SampleService } from '../../sample.service';
import {MatDialog,MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material';
import { DefaultLayoutComponent } from '../../containers';

// export interface DialogData {
// this.model;
// }


@Component({
  selector: 'app-home',
  templateUrl: './exeteledatalist.component.html',
})
export class ExeTeledatalistComponent  {

  displayedColumns: string[] = ['date','assign','id','name','mobile','email','address','bankname','bank','turnover','telename','comment','edit'];
  samples:any;
  dataSource;

  constructor(private route:ActivatedRoute, private router:Router,
    private commonservice:CommonService, private service:SuperadminService,
    private excelservice:SampleService,public dialog: MatDialog,
    public defaultlayout: DefaultLayoutComponent) { }
    coins:any;
   @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

  
fetchdata:any;
model:any = {};
aa:any;
// posts:Memberlist[] = [];
totalPosts = 0;
postsPerPage = 100;
currentPage = 1;
pageSizeOptions = [ 100, 300, 500];
isLoading = false;
sdate;
emp = 2;
idvalue;
exeid:any;
val:any;
  ngOnInit() {   
    this.isLoading = true;
    this.exeid = localStorage.getItem("id");
    this.val={empid:this.exeid}
    this.commonservice.appointmentopenstatus(this.val).subscribe(res=>{
      this.defaultlayout.ngOnInit();
      console.log(res);
     });

    this.commonservice.getEnquirylistexe(this.postsPerPage, this.currentPage,this.exeid);
    this.commonservice
    .getEnquirylistexeDetails()
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
    this.commonservice.getEnquirylistexe(this.postsPerPage, this.currentPage,this.exeid);
  }
  editData(id){
    console.log(id);
    this.commonservice.editData(id);
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
    this.commonservice.geEnquiryDatalist(this.postsPerPage, this.currentPage, this.sdate,this.exeid);
    this.commonservice
      .getEnquiryDatalistDetails()
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
refresh(): void {
  window.location.reload();
}




}



