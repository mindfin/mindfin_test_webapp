import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';




@Component({
  selector: 'app-home',
  templateUrl: './executivetopuplist.component.html',
})
export class ExecutivetopuplistComponent  {



  constructor(private route:ActivatedRoute, private router:Router,
    // notifier: NotifierService ,
    private commonservice:CommonService) {		
      // this.notifier = notifier;
    }
  

  
fetchData:any;
idvalue:any;

// posts:Memberlist[] = [];

  ngOnInit() {
   
    // const id=localStorage.getItem('id');
    //  this.commonservice.getexecutivetopuplist(id).subscribe(res=>{
    // console.log(res);
    // this.fetchData = res;
    // });
    {
      this.route.params.subscribe(params=>{
      console.log(params['id']);
      this.idvalue = params['id'];
      this.commonservice.gettopuplist(this.idvalue).subscribe(res=>{
      console.log(res);
      this.fetchData = res;
      });
      }) 
      }
  }

  topUpSucess(obj){
      console.log(obj);
      this.commonservice.topUpSucess(obj).subscribe(res=>{
          console.log(res);  
      })
  }


refresh(): void {
  window.location.reload();
}

 



 }
