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
  templateUrl: './teledatalist.component.html',
})
export class TeledatalistComponent  {

  displayedColumns: string[] = ['date','id','name','mobile','email','bankname','comment','turnover','edit'];
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
this.commonservice.getEnquirylist(this.postsPerPage, this.currentPage,this.teleid);
this.commonservice
.getEnquirylistDetails()
 .subscribe((postData: {posts: SuperadminService[], postCount: number})=> {
  
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
    this.commonservice.getEnquirylist(this.postsPerPage, this.currentPage,this.teleid);
  }
  
  data: any;

demo:any;
array=[];
abc:any;
  exportAsXLSX():void {
    // console.log(this.samples);
let come=this.samples;
var a;
const fileName="MemberList";
    for(let i=0;i< come.length;i++){
      a = this.samples[i].idland.price - this.samples[i].dueamount;
      this.array.push({
        "Seniority ID":this.samples[i].sid,
        "Membership ID":this.samples[i].mid,
        "Member Name":this.samples[i].name,
        "EmailId":this.samples[i].email,
        "Mobile":this.samples[i].mobile,
        "Address":this.samples[i].address,
        "Project Name":this.samples[i].pname.project_name,
        "Plot Size":this.samples[i].psize.length+'X'+this.samples[i].psize.breadth,
        "Project Amount":this.samples[i].idland.price,
        "Paid Amount":a,
        "Balance Amount":this.samples[i].dueamount
      });
    }
      console.log(this.array);
    
            
              // console.log(this.array);   
              this.excelservice.JSONToCSVConvertor(this.array, "Report", true,fileName);
    

 }

rejectmember(element)
{
  this.service.rejectmember(element);
}

viewbank(element){
this.commonservice.viewbank(element);
}
editmember(element){
    console.log(element);
}
editData(id){
  console.log(id);
  this.commonservice.editData(id);
}
addbank(id){
  this.commonservice.addbank(id);

}
refresh(): void {
  window.location.reload();
}




}



