import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-addadmin',
  templateUrl: './user.component.html',
//   styleUrls: ['./loantype.component.scss']
})
export class UserComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router:Router,private service: CommonService) { }

  
obj:any;
fetchData:any;
model: any = {};



  onSubmit(){
    this.service.userinsert(this.model);
   }

  ngOnInit() {
     this.service.getuserlist().subscribe(res=>{
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
