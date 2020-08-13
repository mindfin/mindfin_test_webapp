import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { SuperadminService } from '../../superadmin.service';
import { PageEvent, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SampleService } from '../../sample.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './customer.component.html',
})
export class CustomerComponent {

  displayedColumns: string[] = ['date', 'name', 'cname', 'mobile', 'email', 'Edit', 'View', 'Delete'];
  samples: any;
  dataSource;

  constructor(private route: ActivatedRoute, private router: Router,
    private commonservice: CommonService, private service: SuperadminService, private excelservice: SampleService, public dialog: MatDialog) { }
  coins: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selectedFile: File = null;
  selectedFile1: File = null;
  selectedFile2: File = null;
  fetchdata: any;
  model: any = {};
  aa: any;
  idvalue: any;
  memberid: any;
  totalPosts = 0;
  postsPerPage = 100;
  currentPage = 1;
  pageSizeOptions = [100, 300, 500];
  isLoading = false;
  data: any;
  emp = 2;
  ngOnInit() {
    this.memberid = localStorage.getItem("id");
    this.isLoading = true;
    this.commonservice.viewcustomerid(this.postsPerPage, this.currentPage, this.memberid);
    this.commonservice
      .viewcustomeridDetails()
      .subscribe((postData: { posts: SuperadminService[], postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.dataSource = new MatTableDataSource(postData.posts);
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
    this.commonservice.viewcustomerid(this.postsPerPage, this.currentPage, this.memberid);
  }
  
  touplist(element) {
    this.commonservice.topuplist(element)
  }
  refresh(): void {
    window.location.reload();
  }

  editcustomer(id) {
    console.log(id);
    this.commonservice.banklist(id);
  }
  openDialog(element) {

    this.model = element;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { element };

    this.dialog.open(EdialogContent, dialogConfig


    );
    console.log(dialogConfig);

  }
}


@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'edialog-content.html',
})

export class EdialogContent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}








