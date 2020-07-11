import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-addadmin',
  templateUrl: './bulksms.component.html',
//   styleUrls: ['./loantype.component.scss']
})
export class BulksmsComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router:Router,private service: CommonService) { }

  
obj:any;
fetchData:any;
model: any = {};



  onSubmit(obj){
      console.log(obj);
    this.service.bulkSms(obj).
        subscribe(res=>{
        console.log(res);
    });
   }

  ngOnInit() {
     this.service.getbanklist().subscribe(res=>{
    console.log(res);
    this.fetchData = res;
  });



  }
  refresh(): void {
    window.location.reload();
  }
  editproject(pro){
    console.log(pro);
    this.model = pro;
  }
}
