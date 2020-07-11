import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-addadmin',
  templateUrl: './checktrack.component.html',
//   styleUrls: ['./loantype.component.scss']
})
export class ChecktrackComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router:Router,private service: CommonService) { }

  
obj:any;
fetchData:any;
model: any = {};



  onSubmit(){
      console.log(this.model.bankname);
    this.service.checktrack(this.model.bankname);
    //     subscribe(res=>{
    //     console.log(res);
    // });
   }

  ngOnInit() {
     this.service.getbanklist().subscribe(res=>{
    console.log(res);
    this.fetchData = res;
  });



  }
  refresh(): void {
    window.location.reload();
  }
  editproject(pro){
    console.log(pro);
    this.model = pro;
  }
}
