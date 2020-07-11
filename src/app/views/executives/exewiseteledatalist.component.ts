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
  templateUrl: './exewiseteledatalist.component.html',
})
export class ExeWiseTeledatalistComponent  {

  displayedColumns: string[] = ['date','id','name','mobile','email','address','bankname','telename','comment'];
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
idvalue;
exeid:any;
  ngOnInit() {
    this.isLoading = true;  
    this.route.params.subscribe(params=>{
      // console.log(params['id']);
      this.exeid=params['id'];
      this.idvalue = params['id'];
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

refresh(): void {
  window.location.reload();
}




}



