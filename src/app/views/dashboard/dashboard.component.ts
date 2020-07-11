import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import * as Canvasjs from './canvasjs.min';
import { CommonService } from '../../common.service';
@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  data = [];
  data1 = [];
  noproject: any;
  fetchData: any;
  fetchData1: any;
  fetchData2: any;
  fetchData3: any;
  fetchData5: any;
  fetchdata4: any;
  constructor(private route: ActivatedRoute
    , private router: Router, private service: CommonService) { }
  ngOnInit() {
    this.service.employeecount().subscribe(res => {
      console.log(res[0]);
      this.fetchData3 = res[0].a;
    });
    this.service.casereject().subscribe(res => {
      console.log(res);
      this.fetchData1 = res;
    });
    this.service.casedisburse().subscribe(res => {
      console.log(res);
      this.fetchData5 = res;
    });
    this.service.casepd().subscribe(res => {
      console.log(res);
      this.fetchData2 = res;
    });
    this.service.piechart().subscribe(res => {
      console.log(res);
      this.fetchData = res;
      for (var i = 0; i < this.fetchData.length; i++) {
        this.data.push({
          "y": this.fetchData[i].total,
          "name": this.fetchData[i].user
        })
      }
      console.log(this.data);
      let chart = new Canvasjs.Chart("users-medium-pie-chart", {
        theme: "light2",
        animationEnabled: true,
        exportEnabled: true,
        title: {
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
    this.service.dataentrypiechart().subscribe(res => {
      console.log(res);
      this.fetchdata4 = res;
      console.log(this.fetchdata4)
      for (var i = 0; i < this.fetchdata4.length; i++) {
        this.data1.push({
          "y": this.fetchdata4[i].total,
          "name": this.fetchdata4[i].status
        })
      }
      console.log(this.data);
      let chart = new Canvasjs.Chart("users-category-pie-chart", {
        theme: "light2",
        animationEnabled: true,
        exportEnabled: true,
        title: {
        },
        data: [{
          type: "pie",
          showInLegend: true,
          toolTipContent: "<b>{name}</b>: {y}",
          indexLabel: "{name}",
          dataPoints: this.data1
        }
        ]
      });
      chart.render();
    });
  }
}