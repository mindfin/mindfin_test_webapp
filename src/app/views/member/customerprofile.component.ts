import { Component, OnInit } from '@angular/core';
import { CommonService } from'../../common.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { MemberService } from '../../member.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-product',
  templateUrl: './customerprofile.component.html',
//   styleUrls: ['./product.component.scss']
})
export class CustomerprofileComponent {

  constructor( private route: ActivatedRoute, private router:Router,private service: CommonService) { }

model:any;


  ngOnInit()
        {

            const id=localStorage.getItem('id');
            this.service.singleCustomer(id).subscribe(res=>{
                console.log(res);       
                this.model = res[0];
            })              
        }    



 trackstatus(id){
console.log(id)
 this.service.checktrack(id);
}

refresh(): void {
  window.location.reload();
}

}