import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-home',
  templateUrl: './backenddailyroutine.component.html',
  //   styleUrls: ['./loantype.component.scss']
})
export class BackendDailyRoutineComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private service: CommonService) { }


  obj: any;
  fetchData: any;
  fetchData1: any;
  model: any = {};
  tempval: any;
  array: any = [];
  idvalue: any;
  vvv: any;

  clearFilters() {
    this.model.companyname = '';
    this.model.bankname = '';
    this.model.whosecase = '';
    this.model.status = '';
  }
  addvalues() {
    console.log(this.model.idbank);
    console.log(this.fetchData);
    var abc = this.model.bankname.split(",", 3);
    // var def = this.model.previousapplytype.split(",", 2);

    this.array.push({
      companyname: this.model.companyname,
      bankname: abc[1],
      bankid: abc[0],
      whosecase: this.model.whosecase,
      status: this.model.status,
      comment:this.model.comment

    })
    console.log(this.array);
    this.tempval = this.array;

  }
  submitForm() {
    console.log(this.array);
    this.idvalue = localStorage.getItem("id");
    this.vvv = {
      arr: this.array,
      idvalue: this.idvalue
    }
    this.service.addroutine(this.vvv);
    //   .subscribe(res=>{
    //    window.location.reload();
    //  })
  }

  // onSubmit() {
  //   console.log(this.model);
  //   const empid = localStorage.getItem("id");
  //   this.service.addroutine(this.model, empid).subscribe(res => {
  //     console.log(res);
  //   })
  // }

  ngOnInit() {
    this.service.getwhosecase().subscribe(res => {
      console.log(res);
      this.fetchData1 = res;
    })
    this.service.getbankname().subscribe(res => {
      console.log(res);
      this.fetchData = res;
    })
    //   this.service.getexecutivelist().subscribe(res=>{
    //     console.log(res);
    //     this.fetchData = res;
    //   });


  }
  refresh(): void {
    window.location.reload();
  }
  editproject(pro) {
    console.log(pro);
    this.model = pro;
  }
  removevalue(pro,index)
{
  console.log(index);
  this.array.splice(index,1);

}
}
