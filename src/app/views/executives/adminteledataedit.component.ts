import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';
import { ActivatedRoute, Router } from '@angular/router';


export interface User {
  name: string;
}
@Component({
  templateUrl: './adminteledataedit.component.html',
})

export class AdminTeledataEditComponent {
  myControl = new FormControl();
  val: any = [];
  selectedFile: File = null;
  selectedFile1: File = null;
  selectedFile2: File = null;
  loantype:any;
  loancatg:any;

  constructor(private commonservice: CommonService,private route: ActivatedRoute,private router:Router) { }

  // options: User[] = this.val;
  // filteredOptions: Observable<User[]>;
  model: any = {};
  fetchData: any;
  fetchDataa: any;
  fetchData1: any;
  fetchData2: any;
  value2: any;
  dob: any;
  teleid: any;
  idvalue;

  ngOnInit() {
    // this.commonservice.getuserlist().subscribe(res => {
    //   console.log(res);
    //   this.fetchData = res;
    // });
    this.commonservice.getbanklist().subscribe(res => {
      console.log(res);
      this.fetchData2 = res;
    });
    this.commonservice.getloanlist().subscribe(res => {
      console.log(res);
      this.fetchDataa = res;
    });
    this.commonservice.getadminexecutivelist().subscribe(res=>{
      console.log(res);
      this.fetchData1=res;
    });

    this.teleid = localStorage.getItem("id");
    console.log(this.teleid);
    
    this.route.params.subscribe(params => {
      console.log(params['id']);
      this.idvalue = params['id'];
      this.commonservice.teleeditDataa(params['id']).subscribe(res => {
        console.log(res);
        this.model = res[0];
      });
    })
  }
  // orgValueChange(date){
  //   //console.log('');
  //   this.dob=date;
  // }


  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;

  }


  submitForm(value) {
    console.log(value);
    // this.value2 = { value: value, teleid: this.idvalue };

    this.commonservice.updateenquiry(value);
    this.router.navigate(["/executives/admindata"]);
    //  .subscribe(res=>{
    //   window.location.reload();
    // })
  }
  refresh(): void {
    window.location.reload();
  }
  onChange(event){
    console.log(event);
   this.loantype= event
  }
  onChange1(event){
    console.log(event);
   this.loancatg= event
  }
}