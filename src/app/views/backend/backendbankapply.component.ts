import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-addadmin',
  templateUrl: './backendbankapply.component.html',
  //   styleUrls: ['./loantype.component.scss']
})
export class BackendBankapplyComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private service: CommonService) { }


  obj: any;
  fetchData: any;
  fetchData2: any;
  model: any = {};
  selectedFile;
  bname: any;
  idvalue: any;
  empid: any;
  vvv: any;
  tempval: any;
  array: any = [];
  fetchData1: any;
  fetchData3: any;
  fetchData4: any;
  empname: any;

  onSubmit() {
    this.service.bankinsert(this.model);
  }

  ngOnInit() {
    this.service.getloanlist().subscribe(res => {
      console.log(res);
      this.fetchData4 = res;
    });
    this.service.getbanklist().subscribe(res => {
      console.log(res);
      this.fetchData2 = res;
    });
    this.service.getallexecutivelist().subscribe(res => {
      console.log(res);
      this.fetchData3 = res;
    });
    this.route.params.subscribe(params => {
      this.idvalue = params['id'];
    });

    this.route.params.subscribe(params => {
      console.log(params['id']);
      this.idvalue = params['id'];
      this.service.getviewbanklist(this.idvalue).subscribe(res => {
        console.log(res);
        this.fetchData1 = res;
      });
    });
    // this.service.getexecutivelist().subscribe(res => {
    //   this.fetchData = [];
    //   console.log(res);
    //   for (var i = 0; i < Object.keys(res).length; i++) {
    //     if (res[i].iduser != null) {
    //       this.fetchData.push(res[i]);
    //     }
    //   }
    // });
  }

  refresh(): void {
    window.location.reload();
  }
  clearFilters() {
    this.model.idbank = '';
    this.model.amount = '';
    this.model.status = '';
    this.model.product = '';
    this.model.executiveid = '';
    this.model.previousapplytype = '';
  }
  toggleEditable(event) {
    console.log(event.target.checked);
    console.log(event);

    var bagColor: string = '0';
    for (var i = 0; i < this.fetchData.length; i++) {
      if (this.fetchData[i].status1 == true) {
        bagColor = bagColor + "," + "" + this.fetchData[i].idbank + "";
      }
    }
    console.log(bagColor);
    this.bname = bagColor;
  }
  addvalues() {
    console.log(this.model.idbank);
    console.log(this.model.executiveid)
    console.log(this.fetchData);
    var abc = this.model.idbank.split(",", 3);
    var abc1 = this.model.executiveid.split(",", 2);
    var def = this.model.previousapplytype.split(",", 2);

    this.array.push({
      amount: this.model.amount,
      bankname: abc[1],
      bankid: abc[0],
      vendor: abc[2],
      status: this.model.status,
      product: this.model.product,
      executiveid: abc1[0],
      executivename: abc1[1],
      previousapplytype: def[1],
      loanid: def[0]

    })
    console.log(this.array);
    this.tempval = this.array;

  }
  removevalue(pro, index) {
    console.log(index);
    this.array.splice(index, 1);

  }

  submitForm() {
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    console.log(this.array);
    this.vvv = {
      arr: this.array,
      idvalue: this.idvalue,
      empid: this.empid,
      createdbyname: this.empname,
    }
    this.service.backendbankinsert(this.vvv).subscribe(res=>{
      alert("Bank Added Successfully")
      this.ngOnInit();
     })
  }

}
