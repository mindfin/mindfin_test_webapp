import { Component, OnInit, Inject, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { FormControl } from '@angular/forms';
import { SuperadminService } from '../../superadmin.service';
import { MatDialog,MAT_DIALOG_DATA,MatDialogConfig, MatSort, MatTableDataSource, PageEvent } from '@angular/material';

@Component({
  selector: 'app-backend',
  templateUrl: './loginoperation.component.html',
  // styleUrls: ['./addadmin.component.scss']
})
export class LoginOperationComponent implements OnInit {

  myControl = new FormControl();
  val: any = [];

  displayedColumns: string[] = ['date', 'cname', 'name', 'whosecase', 'executive','status', 'view'];
  constructor(private route: ActivatedRoute, private router: Router, private commonservice: CommonService,private dialog: MatDialog) { }
  samples: any;
  dataSource;
  sort: MatSort;
  fetchdata: any;
  model: any = {};
  aa: any;
  totalPosts = 0;
  postsPerPage = 100;
  currentPage = 1;
  pageSizeOptions = [100, 300, 500];
  isLoading = false;
  emp = 2;
  exeid:any;
  empname:any;
  empdesc:any;
  sdate;
  ngOnInit() {


    this.isLoading = true;
    this.exeid = localStorage.getItem("id");
    this.empdesc=localStorage.getItem("desc")
    this.commonservice.getdocument1(this.postsPerPage, this.currentPage,this.empdesc);
    this.commonservice
      .getdocument1Details()
      .subscribe((postData: { posts: SuperadminService[], postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.dataSource = new MatTableDataSource(postData.posts);
        this.samples = postData.posts;
        console.log(postData.posts);
        this.isLoading = false;
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
    this.commonservice.getdocument1(this.postsPerPage, this.currentPage,this.empdesc);
  }
  
  refresh(): void {
    window.location.reload();
  }
  
  loginviewbank(id){
      this.commonservice.loginviewbank(id);
    
    } 
    getreport(obj) {

    
      console.log(obj);
      this.isLoading = true;
      console.log(obj)
      localStorage.setItem("startdate", obj.startdate);
      
      this.sdate = localStorage.getItem("startdate");
      this.commonservice.getdocument2(this.postsPerPage, this.currentPage, this.sdate,this.empdesc);
      this.commonservice
        .getdocument2Details()
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

 