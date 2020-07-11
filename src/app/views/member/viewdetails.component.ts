import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';




@Component({
  selector: 'app-home',
  templateUrl: './viewdetails.component.html',
 })
  export class ViewdetailsComponent  {

  constructor(private route:ActivatedRoute, private router:Router, 
    private commonservice:CommonService) {		
    }
  
    obj:any;
    fetchData:any;
    model: any = {};
    fetchData1:any;
    fetchData2:any;
    fetchData3:any;
  ngOnInit() {
  
  }

    onSubmit(obj){
    console.log(obj)
    this.commonservice.getDetails(obj).subscribe(res=>{
    console.log(res);
    this.fetchData=res[0];   
    })

       this.commonservice.getPreviousBankDetails(obj).subscribe(res=>{
        console.log(res);
        this.fetchData1=res;
        })
    
        this.commonservice.getApprovedBankDetails(obj).subscribe(res=>{
            console.log(res);
            this.fetchData2=res;
            })   

            this.commonservice.accountdetails(obj).subscribe(res=>{
                console.log(res);
                this.fetchData3=res;
                })  
    }

  refresh(): void {
  window.location.reload();
  }

 



 }
