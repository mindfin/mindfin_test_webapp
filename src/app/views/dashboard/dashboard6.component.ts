import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import * as Canvasjs from './canvasjs.min';
import { CommonService } from '../../common.service';
@Component({
  templateUrl: 'dashboard6.component.html'
})
export class Dashboard6Component implements OnInit {


  data = [];
  noproject: any;
  fetchData: any;
  fetchData1: any;
  fetchData2: any;
  fetchData3: any;
  fetchData4: any;
  fetchData5: any;
  fetchData6: any;

  exeid: any;

  constructor(private route: ActivatedRoute
    , private router: Router, private service: CommonService) { }

  ngOnInit() {
    this.service.dataentrypiechart().subscribe(res=>{
      console.log(res);
      this.fetchData = res;
    
      for(var i=0;i<this.fetchData.length;i++){
        this.data.push({
          "y":this.fetchData[i].total,
        "name":this.fetchData[i].status
        })
      }
      console.log(this.data);
      let chart = new Canvasjs.Chart("chartContainer1", {
        theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
        title:{
          text: "Data Entry"
        },
        data: [{
          type: "pie",
          showInLegend: true,
          toolTipContent: "<b>{name}</b>: {y}",
          indexLabel: "{name}",
          dataPoints: this.data
       
        }
      ]
    
      });
    
      chart.render();
    
    });
  }
}