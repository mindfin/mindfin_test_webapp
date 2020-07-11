import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-addadmin',
  templateUrl: './topuplist.component.html',
//   styleUrls: ['./loantype.component.scss']
})
export class TopuplistComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router:Router,private service: CommonService) { }

  
// obj:any;
// fetchData:any;
fetchData:any;
model: any = {};
idvalue:any;
// period:any;

 
//    onchange(obj){

// var obj1={obj:obj,period:this.period}
// console.log(obj1)
// this.service.addPeriod(obj1).subscribe(res=>{
//   console.log(res);
//   // this.fetchData = res;
// });
//    }


  ngOnInit()
        {
        this.route.params.subscribe(params=>{
        console.log(params['id']);
        this.idvalue = params['id'];
        this.service.gettopuplist(this.idvalue).subscribe(res=>{
        console.log(res);
        this.fetchData = res;
        });
        }) 
        }


    refresh(): void
    {
    window.location.reload();
   }
 
}
