import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';




@Component({
  selector: 'app-home',
  templateUrl: './subvendor.component.html',
})
export class SubvendorComponent  {



  constructor(private route:ActivatedRoute, private router:Router,
    // notifier: NotifierService ,
    private commonservice:CommonService) {		
      // this.notifier = notifier;
    }
  

  
fetchData:any;


  ngOnInit() {
   
     this.commonservice.getSubVendor().subscribe(res=>{
    console.log(res);
    this.fetchData = res;
    });
  
  }

 customerList(obj){

     console.log(obj)
     this.commonservice.CustomerList(obj);
    //  .subscribe(res=>{
    //      console.log(res);
    //  })
 }


refresh(): void {
  window.location.reload();
}

 



 }
