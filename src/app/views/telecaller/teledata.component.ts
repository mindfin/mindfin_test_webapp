import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';


export interface User {
  name: string;
}
@Component({
  templateUrl: './teledata.component.html',
})

export class TeledataComponent {
  myControl = new FormControl();
  val: any = [];
  selectedFile: File = null;
  selectedFile1: File = null;
  selectedFile2: File = null;

  constructor(private commonservice: CommonService,private router:Router) { }

  // options: User[] = this.val;
  // filteredOptions: Observable<User[]>;
  model: any = {};
  fetchData: any;
  fetchDataa: any;
  fetchData1: any;
  fetchData2: any;
  value1: any;
  dob: any;
  teleid: any;
  loantype:any;
  loancatg:any;


  ngOnInit() {
    this.commonservice.getuserlist().subscribe(res => {
      console.log(res);
      this.fetchData = res;
    });

    this.commonservice.getloanlist().subscribe(res => {
      console.log(res);
      this.fetchDataa = res;
    });
    this.commonservice.getadminexecutivelist().subscribe(res => {
      console.log(res);
      this.fetchData1 = res;
    });
    this.commonservice.getbanklist().subscribe(res => {
      console.log(res);
      this.fetchData2 = res;
    });
    this.teleid = localStorage.getItem("id");
    console.log(this.teleid);
  }
  // orgValueChange(date){
  //   //console.log('');
  //   this.dob=date;
  // }

  onChange(event){
    console.log(event);
   this.loantype= event
  }
  onChange1(event){
    console.log(event);
   this.loancatg= event
  }
  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;

  }


  submitForm(value) {
    console.log(value);
    this.value1 = { value: value, teleid: this.teleid };

    this.commonservice.addenquiry(this.value1).subscribe(res => {
      console.log(res);
      this.clearFilters()
    })

  }
  refresh(): void {
    window.location.reload();
  }
  redirect(){
    this.router.navigate(["/telcaller/teledatalist"]);
  }
  clearFilters(){
    this.model.name='';
    this.model.email='';
    this.model.gender='';
    this.model.mobile='';
    this.model.altmobile='';
    this.model.address='';
    this.model.applytype='';
    this.model.loanCategory='';
    this.model.subLoanCategory='';
    this.model.turnover='';
    this.model.ownHouse='';
    this.model.executive='';
    this.model.approchedBank='';
    this.model.status='';
    this.model.comment='';
  }
}