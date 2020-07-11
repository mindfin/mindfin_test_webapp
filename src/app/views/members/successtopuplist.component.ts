// import { Component, OnInit,ViewChild,Inject} from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonService } from '../../common.service';
// @Component({
//   selector: 'app-home',
//   templateUrl: './successtopuplist.component.html',
// })
// export class SuccesstopuplistComponent  {
//   constructor(private route:ActivatedRoute, private router:Router,
//     private commonservice:CommonService) {		
//     }

// fetchData:any;
//   ngOnInit() {
   
//      this.commonservice.getsuccesstopuplist().subscribe(res=>{
//     console.log(res);
//     this.fetchData = res;
//     });
//   }
//   topUpSucess(obj){
//       console.log(obj);
//       this.commonservice.topUpSucess(obj).subscribe(res=>{
//           console.log(res);  
//       })
//   }
// refresh(): void {
//   window.location.reload();
// }
//  applyLoan(obj){
//    console.log(obj);
//    this.commonservice.applyLoan(obj);
//  }
//  }



import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { SuperadminService } from '../../superadmin.service';
import { PageEvent, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SampleService } from '../../sample.service';
import {MatDialog,MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material';



@Component({
  selector: 'app-home',
  templateUrl: './successtopuplist.component.html',
})
export class SuccesstopuplistComponent  {

  displayedColumns: string[] = ['date','ID','name','mobile','email','applyloan'];
  samples:any;
  dataSource;

  constructor(private route:ActivatedRoute, private router:Router,
    private commonservice:CommonService, private service:SuperadminService,private excelservice:SampleService,public dialog: MatDialog) {		
    }
    coins:any;
   @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

  
fetchdata:any;
model:any = {};
aa:any;
totalPosts = 0;
postsPerPage = 100;
currentPage = 1;
pageSizeOptions = [ 100, 300, 500];
isLoading = false;
emp = 2;
  ngOnInit() {
   

this.isLoading = true;
this.commonservice.getsuccesstopuplist(this.postsPerPage, this.currentPage);
this.commonservice
.getsuccesstopuplistDetails()
 .subscribe((postData: {posts: SuperadminService[], postCount: number})=> {
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
    this.commonservice.getsuccesstopuplist(this.postsPerPage, this.currentPage);
  }
  
  data: any;

demo:any;
array=[];
abc:any;


 
public showNotification(element): 
 
 void {  
    //  this.notifier.notify(element);

   console.log(element);
   this.commonservice.getaging(element).subscribe(res=>{
    console.log(res);
   })
}

refresh(): void {
  window.location.reload();
}

  applyLoan(obj){
   console.log(obj);
   this.commonservice.applyLoan(obj);
 }

exportAsXLSX():void {
  console.log(this.samples);
  let come=this.samples;
  var a;
  const fileName="Topup Sucessfull List";
      for(let i=0;i< come.length;i++){
        this.array.push({
          "Customer ID":this.samples[i].autoid,
          "Customer Name":this.samples[i].name,
          "Mobile":this.samples[i].mobile,
          "EmailId":this.samples[i].email,
          "Company Email":this.samples[i].cemail,
          "Address":this.samples[i].address,
          "Company Name":this.samples[i].cname,
          "Alternate Number":this.samples[i].altmobile,
          "Source":this.samples[i].source,
          // "Loantype":this.samples[i].loantype,
          // "Executive Name":this.samples[i].empname,
          // "Loan Amount":this.samples[i].amount,

        });
      }
        console.log(this.array);
      
              
                // console.log(this.array);   
                this.excelservice.JSONToCSVConvertor(this.array, "Report", true,fileName);
      
  
   }
  






}



