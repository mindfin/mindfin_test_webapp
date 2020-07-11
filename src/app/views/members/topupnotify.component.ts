import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';




@Component({
  selector: 'app-home',
  templateUrl: './topupnotify.component.html',
})
export class TopupnotifyComponent  {



  constructor(private route:ActivatedRoute, private router:Router,
    // notifier: NotifierService ,
    private commonservice:CommonService) {		
      // this.notifier = notifier;
    }
  

  
fetchData:any;
idvalue:any;

// posts:Memberlist[] = [];

  ngOnInit() {
   

// this.isLoading = true;
// this.commonservice.gettopupnotifylist(this.postsPerPage, this.currentPage);
// this.commonservice
// .gettopupnotifylistDetails()
//  .subscribe((postData: {posts: SuperadminService[], postCount: number})=> {
//     this.totalPosts = postData.postCount;
//     this.dataSource = new MatTableDataSource(postData.posts);
// this.samples = postData.posts;
// console.log(postData.posts);
// this.isLoading = false;
// this.dataSource.sort = this.sort;
// console.log(this.dataSource.sort);

// });
    //  this.commonservice.gettopupnotifylist().subscribe(res=>{
    // console.log(res);
    // this.fetchData = res;
    // });
    this.route.params.subscribe(params=>{
      console.log(params['id']);
      this.idvalue = params['id'];
      this.commonservice.gettopuplist(this.idvalue).subscribe(res=>{
      console.log(res);
      this.fetchData = res;
      });
      }) 
  }

  topUpSucess(obj){
      console.log(obj);
      this.commonservice.topUpSucess(obj).subscribe(res=>{
          console.log(res);  
      })
  }
//   applyFilter(filterValue: string) {
//     console.log(filterValue);
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }
//   onChangedPage(pageData: PageEvent) {
//     this.isLoading = true;
//     this.currentPage = pageData.pageIndex + 1;
//     this.postsPerPage = pageData.pageSize;
//     console.log(this.postsPerPage);
//     this.commonservice.getDisburstlist(this.postsPerPage, this.currentPage);
//   }
  
  

// exportAsXLSX():void {
//   console.log(this.samples);
//   let come=this.samples;
//   var a;
//   const fileName="Disbursed List";
//       for(let i=0;i< come.length;i++){
//         this.array.push({
//           "Customer ID":this.samples[i].autoid,
//           "Customer Name":this.samples[i].name,
//           "Mobile":this.samples[i].mobile,
//           "EmailId":this.samples[i].email,
//           "Address":this.samples[i].address,
//           "Company Name":this.samples[i].cname,
//           "Alternate Number":this.samples[i].altmobile,
//           "Source":this.samples[i].source,
//           "Loantype":this.samples[i].loantype,
//           "Executive Name":this.samples[i].empname,
//           "Loan Amount":this.samples[i].amount,

//         });
//       }
//         console.log(this.array);
      
              
//                 // console.log(this.array);   
//                 this.excelservice.JSONToCSVConvertor(this.array, "Report", true,fileName);
      
  
//    }
  
 




// public showNotification(element): 
 
//  void {  
//     //  this.notifier.notify(element);

//    console.log(element);
//    this.commonservice.getaging(element).subscribe(res=>{
//     console.log(res);
//    })
// }

refresh(): void {
  window.location.reload();
}

 

// openDialog(element) {
// this.model=element;
//   const dialogConfig = new MatDialogConfig();
//   dialogConfig.data = {element};
//   this.dialog.open(DisburstdialogContent,dialogConfig
// );
// console.log(dialogConfig );

// }}


// @Component({
//   selector: 'dialog-content-example-dialog',
//   templateUrl: 'disburstdialog-content.html',
// })

// export class DisburstdialogContent{ 
//   constructor(@Inject(MAT_DIALOG_DATA) public data:any) {}


 }
