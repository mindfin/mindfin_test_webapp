import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-addadmin',
  templateUrl: './bankdisburse.component.html',
//   styleUrls: ['./loantype.component.scss']
})
export class BankdisburseComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router:Router,private service: CommonService) { }

  
obj:any;
fetchData:any;
fetchData1:any;
fetchData2:any;
model: any = {};
idvalue:any;
period:any;

  

   getperiod(obj){
       this.period=obj;
    console.log(obj);
}
onchange(obj){

  var obj1={obj:obj,period:this.period}
  console.log(obj1)
  this.service.addPeriod(obj1).subscribe(res=>{
    this.router.navigate(["/members/custstatus/"+ this.idvalue]);

  });
     }
//    getperiod(obj){
//        console.log(obj);
//    }

  ngOnInit() {
    this.route.params.subscribe(params=>{
        console.log(params['id']);
        this.idvalue = params['id'];
     this.service.getviewbanklistt(this.idvalue).subscribe(res=>{
    console.log(res);
    this.fetchData = res;
  });

  this.service.getPeriod().subscribe(res=>{
    console.log(res);
    this.fetchData2 = res;
  });

  this.service.getApprovedBankList(this.idvalue).subscribe(res=>{
    // console.log(res);
    this.fetchData1 = res;
  });


})
  
  }

 
  refresh(): void {
    window.location.reload();
  }
  
}
