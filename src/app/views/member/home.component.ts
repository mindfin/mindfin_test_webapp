import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { MemberService } from '../../member.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  // styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(private route:ActivatedRoute, private router:Router,
    private service:CommonService,private memberservice:MemberService) { }
  

  
fetchdata;

  ngOnInit() {
    const memberid = localStorage.getItem("id");
    // const memberid="5bdd5230999d730fbdf8d212";
    console.log(memberid);

    this.service.homememberlist(memberid).subscribe(res=>{
      // console.log(res);
     this.fetchdata=res[0];
//      this.fetchdata.sqrt=this.fetchdata.length *this.fetchdata.breadth;  
// // this.fetchdata.totalpaid=(this.fetchdata.totalamount)+(this.fetchdata.calc);
//      this.fetchdata.calc = (this.fetchdata.share) + (this.fetchdata.applicationfee) +
//      (this.fetchdata.admissionfee) + (this.fetchdata.sharefee)+(this.fetchdata.welfarefund);
//      this.fetchdata.totalpaid=(this.fetchdata.totalamount)+(this.fetchdata.calc);

  });
  
  }

}
