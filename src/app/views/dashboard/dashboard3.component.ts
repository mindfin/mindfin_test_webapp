import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import * as Canvasjs from './canvasjs.min';
import { CommonService } from '../../common.service';
@Component({
  templateUrl: 'dashboard3.component.html'
})
export class Dashboard3Component implements OnInit {


  data = [];
  noproject:any;
  fetchData:any;
  fetchData1:any;
  fetchData2:any;
  fetchData3:any;
  teleid:any;
  desc:any

 constructor( private route: ActivatedRoute
  , private router:Router,private service: CommonService) { }

  ngOnInit() {

    // this.service.enquirycount1().subscribe(res=>{
    //     console.log(res);
    //     this.fetchData2 = res;
    // });
    this.teleid=localStorage.getItem("desc");
    this.service.logincount(this.teleid).subscribe(res=>{
      console.log(res);
      this.fetchData2 = res;
  });
  
 
//     this.service.membercount().subscribe(res=>{
//       console.log(res);
//       this.noproject = res[0]['a'];
//   });
//   this.service.pendingcount().subscribe(res=>{
//     console.log(res);
//     if(res=='0'||res==undefined){
//       console.log("hi");
//       this.fetchData3 = 0;
//     }else{
//       console.log("hir");
//     this.fetchData3 = res[0]['a'];
//     }
// });
// this.service.rejectcount().subscribe(res=>{
//   console.log(res);
//   this.fetchData1 = res[0]['a'];
// });

  // this.service.piechart().subscribe(res=>{
  //   console.log(res);
  //   this.fetchData = res;

    // for(var i=0;i<this.fetchData.length;i++){
    //   this.data.push({
    //     "y":this.fetchData[i].total,
    //   "name":this.fetchData[i].user
    //   })
    // }
    // console.log(this.data);
    // let chart = new Canvasjs.Chart("chartContainer", {
    //   theme: "light2",
		// animationEnabled: true,
		// exportEnabled: true,
    //   title:{
    //     text: "EMPLOYEE DETAILS"
    //   },
    //   data: [{
    //     type: "pie",
    //     showInLegend: true,
    //     toolTipContent: "<b>{name}</b>: {y}",
    //     indexLabel: "{name}",
    //     dataPoints: this.data
     
    //   }
    // ]

    // });

    // chart.render();
  
// });


}
}