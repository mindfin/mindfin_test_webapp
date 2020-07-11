 import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-home',
  templateUrl: './addlogexestatus.component.html',
//   styleUrls: ['./loantype.component.scss']
})
export class AddLogexeSatausComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router:Router,private service: CommonService) { }

  
obj:any;
fetchData:any;
model: any = {};

  idvalue;

  onSubmit(element){
    console.log(element);
    const empid=localStorage.getItem("id");
    const empname=localStorage.getItem("empname");
    
    this.service.sentlogexe(element,empid,empname).subscribe(res => {
      this.router.navigate(["/loginoperation/loginstatus/"+this.model.idcustomer]);
    })
    
   }

  ngOnInit() {
     
    this.service.getloginexecutivelist().subscribe(res => {
      this.fetchData = [];
      console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData.push(res[i]);
        }
      }
    });
  this.route.params.subscribe(params => {
    console.log(params['id']);
    this.idvalue = params['id'];
    this.service.sentexelogedit1(this.idvalue).subscribe(res => {
      console.log(res);
      this.model = res[0];
    });
  })

  }
  refresh(): void {
    window.location.reload();
  }
  editproject(pro){
    console.log(pro);
    this.model = pro;
  }
}
