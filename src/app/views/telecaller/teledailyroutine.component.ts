import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-home',
  templateUrl: './teledailyroutine.component.html',
  //   styleUrls: ['./loantype.component.scss']
})
export class TeleDailyRoutineComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private service: CommonService) { }


  obj: any;
  fetchData: any;
  fetchData1: any;
  model: any = {};
  tempval: any;
  array: any = [];
  idvalue: any;
  empid:any;
  empName:any;
  vvv: any;
  currentPage = 1;
  postsPerPage = 7;
  pageSizeOptions = [7, 20, 30];
 
  addvalues(value) {
    this.empid = localStorage.getItem("id");
    this.empName = localStorage.getItem("empname");
    this.vvv = { empID:this.empid , empname: name, data: value};
 this.service.addteleroutine(this.vvv).subscribe(res => {
  alert("Routine Added Successfully");
  this.ngOnInit();
  this.clearFilters();
 })
  }
  
  clearFilters() {
    this.model.NOC = '';
    this.model.NOF = '';
    this.model.NOLG = '';
    this.model.comment = '';
  }
  ngOnInit() {
    this.empid = localStorage.getItem("id");
    this.empName = localStorage.getItem("empname");
    this.service.getTopRoutine(this.postsPerPage, this.currentPage,this.empid).subscribe(res => {
      console.log(res);
      this.fetchData = res;
    })
    
  }
  refresh(): void {
    window.location.reload();
  }
  
}
