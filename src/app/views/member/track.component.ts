import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../common.service';

@Component({
  selector: 'app-customerreport',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {
    public abc = 'superadmin';
    constructor(private http:Http,private router:Router,private service:CommonService,private route: ActivatedRoute)
     { }
  
    val:any;
    trackreport:any;
    status:any={};
    cust_name:any={};
    reg_no:any={};
    car_model:any={};
    mobile:any={};
    backimg:any={};
    leftimg:any={};
    rightimg:any={};
    email:any={};


  ngOnInit() {

    this.route.params.subscribe(params => {
           
        //console.log('');
        this.val = params['id'];
        console.log(this.val);
        var cid=this.val;

        this.service.trackcheck(this.val).subscribe(res=>{
            console.log(res);
            if(res[0]==null||res[0]==undefined||res[0]==''){
              console.log("Given Id not matching");
              this.trackreport='null';
            }else{
            this.trackreport = res;
            console.log(this.trackreport);
             this.status=this.trackreport[0].status;
             this.cust_name=this.trackreport[0].name;
             this.reg_no=this.trackreport[0].autoid;
             this.mobile=this.trackreport[0].mobile;
             this.email=this.trackreport[0].email;
            }
         });

    });


   

  }
}