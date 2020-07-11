import { Component, OnInit, Inject, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { FormControl } from '@angular/forms';
import { SuperadminService } from '../../superadmin.service';
import { MatDialog,MAT_DIALOG_DATA,MatDialogConfig, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { SampleService } from '../../sample.service';

@Component({
  selector: 'app-backend',
  templateUrl: './loginoperationview.component.html',
  // styleUrls: ['./addadmin.component.scss']
})
export class LoginOperationViewComponent implements OnInit {

  myControl = new FormControl();
  val: any = [];

  displayedColumns: string[] = ['date', 'cname', 'name', 'whosecase','executive','bname', 'bvendor','logexe','time','status'];
  constructor(private route: ActivatedRoute,private excelservice:SampleService, private router: Router, private commonservice: CommonService,private dialog: MatDialog) { }
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
  sdate;
array=[];
  exeid:any;
  empdesc:any;
  ngOnInit() {


    this.isLoading = true;
    this.exeid = localStorage.getItem("id");
    this.empdesc=localStorage.getItem("desc")
    this.commonservice.getloginlist(this.postsPerPage, this.currentPage,this.empdesc);
    this.commonservice
      .getloginlistDetails()
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
  exportAsXLSX():void {
    console.log(this.samples);
    let come=this.samples;
    var a;
    const fileName="login List";
        for(let i=0;i< come.length;i++){
          this.array.push({
            "login date":this.samples[i].logindate,
            "company name":this.samples[i].companyname,
            "customer name":this.samples[i].customername,
            "whose case":this.samples[i].whosecase,
            "bank name":this.samples[i].bankname,
            "bank vendor":this.samples[i].bankvendor,
            "login executive":this.samples[i].ename,
            "sent time":this.samples[i].timing,
            "status":this.samples[i].astatus,
            
  
          });
        }
          console.log(this.array);
        
                
                  // console.log(this.array);   
                  this.excelservice.JSONToCSVConvertor(this.array, "Report", true,fileName);
        
    
     }
    
  
  
  
  
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    console.log(this.postsPerPage);
    this.commonservice.getloginlist(this.postsPerPage, this.currentPage,this.empdesc);
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
      this.commonservice.getloginlist1(this.postsPerPage, this.currentPage, this.sdate,this.empdesc);
      this.commonservice
        .getloginlist1Details()
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

 