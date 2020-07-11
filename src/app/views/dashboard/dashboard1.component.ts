import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import * as Canvasjs from './canvasjs.min';
import { CommonService } from '../../common.service';
@Component({
  templateUrl: 'dashboard1.component.html'
})
export class Dashboard1Component implements OnInit {


  data = [];
  noproject:any;
  fetchData:any;
  fetchData1:any;
  fetchData2:any;
  fetchData3:any;
  teleid:any;

 constructor( private route: ActivatedRoute
  , private router:Router,private service: CommonService) { }

  ngOnInit() {
    this.teleid = localStorage.getItem("id");

    this.service.enquirycount(this.teleid).subscribe(res=>{
        console.log(res); 
        this.fetchData = res;
    });
    this.service.enquiryapprovecount(this.teleid).subscribe(res=>{
      console.log(res);
      this.fetchData1 = res;
  });
  this.service.enquirydisbursecount(this.teleid).subscribe(res=>{
    console.log(res);
    this.fetchData2 = res;
});
this.service.enquiryrejectcount(this.teleid).subscribe(res=>{
  console.log(res);
  this.fetchData3 = res;
});

}
}