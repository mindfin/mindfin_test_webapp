import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { SuperadminService } from '../../superadmin.service';
// import { CommonService } from '../../superadmin.service';

import { PageEvent, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
// import { Memberlist } from '../../../../models/booking.model';
import { SampleService } from '../../sample.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';

// export interface DialogData {
// this.model;
// }


@Component({
  selector: 'app-home',
  templateUrl: './emppassword.component.html',
})
export class EmpPasswordComponent {

  displayedColumns: string[] = ['slno', 'name','bankname', 'branch', 'mobile', 'email', 'password'];
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
  postsPerPage = 100;
  currentPage = 1;
  pageSizeOptions = [100, 300, 500, 1000];
  isLoading = false;
  emp = 2;
  ngOnInit() {


    this.isLoading = true;
    this.commonservice.getemployeelist(this.postsPerPage, this.currentPage);
    this.commonservice
      .getemployeeDetails()
      .subscribe((postData: { posts: CommonService[], postCount: number }) => {

        this.totalPosts = postData.postCount;
        console.log(postData.posts[0]);
        this.dataSource = new MatTableDataSource(postData.posts);
        // this.dataSource = new (postData.posts);
        this.samples = postData.posts;
        this.isLoading = false;
        // console.log(postData.posts);
        // console.log(postData.postCount);
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
    this.commonservice.getexecutiveelist(this.postsPerPage, this.currentPage);
  }

  data: any;

  demo: any;
  array = [];
  abc: any;
  exportAsXLSX(): void {
    console.log(this.samples);
    let come = this.samples;
    var a;
    const fileName = "EMPLOYEE PASSWORD";
    for (let i = 0; i < come.length; i++) {
      this.array.push({
        "Sl No": this.samples[i].idemployee,
        "Employee Name": this.samples[i].name,
        "Branch": this.samples[i].branch,
        "User type": this.samples[i].user,
        "Mobile": this.samples[i].mobile,
        "Email": this.samples[i].email,
        "password": this.samples[i].orgpassword,
        

      });
    }
    console.log(this.array);


    // console.log(this.array);   
    this.excelservice.JSONToCSVConvertor(this.array, "Report", true, fileName);


  }


  viewtele(id) {
    console.log(id);
    this.commonservice.viewtele(id);

  }
  // rejectmember(element)
  // {
  //   this.service.rejectmember(element);

  // }
  // editmember(id){
  //     console.log(id);
  //     this.commonservice.editmember(id);

  // }


  refresh(): void {
    window.location.reload();
  }



  // openDialog(element) {

  // this.model=element;

  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = {element};

  //    this.dialog.open(DialogContent,dialogConfig


  // );
  // console.log(dialogConfig );

  // }
}


// @Component({
//   selector: 'dialog-content-example-dialog',
//   templateUrl: 'dialog-content.html',
// })

// export class DialogContent{ 


//   constructor(@Inject(MAT_DIALOG_DATA) public data:any) {}

// //   constructor(
// //     @Inject(MAT_DIALOG_DATA) public data: any
// //  ) { }


// }
