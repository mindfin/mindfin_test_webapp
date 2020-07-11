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
  // posts:Memberlist[] = [];
  totalPosts = 0;
  postsPerPage = 100;
  currentPage = 1;
  pageSizeOptions = [100, 300, 500];
  isLoading = false;
  emp = 2;
  ngOnInit() {
    this.memberid = localStorage.getItem("id");

    this.route.params.subscribe(params => {
      console.log(params['id']);
      this.idvalue = params['id'];

    })


    this.isLoading = true;
    this.commonservice.viewcustomerid(this.postsPerPage, this.currentPage, this.memberid);
    this.commonservice
      .viewcustomeridDetails()
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

  data: any;

  demo: any;
  array = [];
  abc: any;
  exportAsXLSX(): void {
    // console.log(this.samples);
    let come = this.samples;
    var a;
    const fileName = "MemberList";
    for (let i = 0; i < come.length; i++) {
      a = this.samples[i].idland.price - this.samples[i].dueamount;
      this.array.push({
        "Seniority ID": this.samples[i].sid,
        "Membership ID": this.samples[i].mid,
        "Member Name": this.samples[i].name,
        "EmailId": this.samples[i].email,
        "Mobile": this.samples[i].mobile,
        "Address": this.samples[i].address,
        "Project Name": this.samples[i].pname.project_name,
        "Plot Size": this.samples[i].psize.length + 'X' + this.samples[i].psize.breadth,
        "Project Amount": this.samples[i].idland.price,
        "Paid Amount": a,
        "Balance Amount": this.samples[i].dueamount
      });
    }
    console.log(this.array);


    // console.log(this.array);   
    this.excelservice.JSONToCSVConvertor(this.array, "Report", true, fileName);


  }

  onFileSelected(event) {
    console.log(event);
    this.selectedFile = <File>event.target.files[0];
  }
  onFileSelected1(event) {
    console.log(event);
    this.selectedFile1 = <File>event.target.files[0];
  }
  onFileSelected2(event) {
    console.log(event);
    this.selectedFile2 = <File>event.target.files[0];
  }
  submitForm(value) {
    console.log(value);
    const fd = new FormData();

    if (this.selectedFile != null) {
      fd.append('cimage', this.selectedFile, this.selectedFile.name);
    }
    else {
      fd.append('cimage', this.model.cimage);
    }
    if (this.selectedFile1 != null) {
      fd.append('pimage', this.selectedFile1, this.selectedFile1.name);
    }
    else {
      fd.append('pimage', this.model.pimage);
    }
    if (this.selectedFile2 != null) {
      fd.append('aimage', this.selectedFile2, this.selectedFile2.name);
    }
    else {
      fd.append('aimage', this.model.aimage);
    }
    // fd.append('cimage',this.selectedFile,this.selectedFile.name);
    // fd.append('pimage',this.selectedFile1,this.selectedFile1.name);
    // fd.append('aimage',this.selectedFile2,this.selectedFile2.name);
    fd.append('name', this.model.name);
    fd.append('dob', this.model.dob);
    fd.append('mobile', this.model.mobile);
    fd.append('email', this.model.email);
    fd.append('altmobile', this.model.altmobile);
    fd.append('salary', this.model.salary);
    fd.append('address', this.model.address);
    fd.append('cname', this.model.cname);
    fd.append('caddress', this.model.caddress);
    fd.append('designation', this.model.designation);
    fd.append('bankname', this.model.bankname);
    fd.append('gender', this.model.gender);
    fd.append('pincode', this.model.pincode);
    fd.append('loanpurpose', this.model.loanpurpose);
    fd.append('idexecutive', this.model.idexecutive);
    fd.append('applytype', this.model.applytype);
    fd.append('previousapplytype', this.model.previousapplytype);
    fd.append('previousbankname', this.model.previousbankname);
    fd.append('previousamounttaken', this.model.previousamounttaken);
    fd.append('id', this.idvalue);



    console.log(fd);
    this.commonservice.customerupdate(fd);
    //  this.refresh();
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








