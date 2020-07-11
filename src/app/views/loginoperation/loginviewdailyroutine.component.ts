import { Component, OnInit, ViewChild } from '@angular/core';
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
  templateUrl: './loginviewdailyroutine.component.html',
//   styleUrls: ['./loantype.component.scss']
})
export class LoginDailyRoutineviewComponent{

  displayedColumns: string[] = ['date','company','bank','whosecase','pov','handover','timings','status','case'];
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
postsPerPage = 100;
currentPage = 1;
pageSizeOptions = [ 100, 300, 500];
isLoading = false;
emp = 2;
teleid:any;
  ngOnInit() {
   

this.isLoading = true;
this.teleid = localStorage.getItem("id");
this.commonservice.viewroutine(this.postsPerPage, this.currentPage,this.teleid);
this.commonservice
.viewroutineDetails().subscribe((postData: {posts: SuperadminService[], postCount: number})=> {
  
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
    this.commonservice.viewroutine(this.postsPerPage, this.currentPage,this.teleid);
  }
  logineditData(id){
  console.log(id);
  this.commonservice.logineditData(id);
}
refresh(): void {
  window.location.reload();
}




}



