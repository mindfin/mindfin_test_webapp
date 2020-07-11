import { Component, OnInit } from '@angular/core';
import { MemberService } from'../../member.service';
import { ActivatedRoute, Router } from '@angular/router';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-product',
  templateUrl: './changepwd.component.html',
//   styleUrls: ['./product.component.scss']
})
export class ChangepwdComponent {

  constructor( private route: ActivatedRoute, private router:Router,private service: MemberService ) { }

model:any={};
memberid:any;
vvv:any;
  ngOnInit()
        {
          this.memberid = localStorage.getItem("id");
          console.log(this.memberid);                  
        }
        onSubmit(obj){
          //   console.log(this.model);
          //  console.log(this.model.bid);
          this.vvv = {
            bname : this.model.currentpassword,
            idvalue : this.memberid,
           cpwd: this.model.changepassword
           }
            this.service.changepwd(this.vvv);
        };
        checkcurrent(obj){
            console.log(this.model.currentpassword);
            console.log(this.memberid);
            this.vvv = {
              bname : this.model.currentpassword,
              idvalue : this.memberid
             }
             this.service.checkcurrentpwd(this.vvv).subscribe(res=>{
                console.log(res);
               this.model.status = res['status']; 
                if(res['status']==true)
                {
              this.model.bid =res['result'][0]['idmember'];
                }
              else
              {
            console.log('bye');
              }
              });
            }

      


refresh(): void {
  window.location.reload();
}

}