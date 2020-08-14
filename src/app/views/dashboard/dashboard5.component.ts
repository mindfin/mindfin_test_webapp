import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import * as Canvasjs from './canvasjs.min';
import { CommonService } from '../../common.service';
@Component({
  templateUrl: 'dashboard5.component.html'
})
export class Dashboard5Component implements OnInit {


  data = [];
  noproject:any;
  fetchData:any;
  fetchData1:any;
  fetchData2:any;
  fetchData3:any;
  fetchData4:any;
  fetchData5:any;
  teleid:any;

 constructor( private route: ActivatedRoute
  , private router:Router,private service: CommonService) { }

  ngOnInit() {
    this.teleid = localStorage.getItem("id");

  //   this.service.enqcount().subscribe(res=>{
  //     console.log(res);
  //     this.fetchData1 = res;
  // });

  this.service.casepd().subscribe(res => {
    console.log(res);
    this.fetchData2 = res;
  });
  this.service.caseapproval().subscribe(res => {
    console.log(res);
    this.fetchData3 = res;
  });
  this.service.casereject().subscribe(res => {
    console.log(res);
    this.fetchData4 = res;
  });
  this.service.casedisburse().subscribe(res => {
    console.log(res);
    this.fetchData5 = res;
  });
// this.service.rejectcount().subscribe(res=>{
//   console.log(res);
//   this.fetchData6 = res;
// });

}
}