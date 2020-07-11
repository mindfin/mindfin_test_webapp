import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MemberService } from '../../member.service';

@Component({
  selector: 'app-dashboard1',
  templateUrl: 'memberlogin.component.html',
//   styleUrls: ['./login.component.scss']
})
export class MemberloginComponent implements OnInit {


  registerForm: FormGroup;
  submittedError;

  constructor(private router:Router,private service:CommonService
    ,private formBuilder: FormBuilder,private memberservice:MemberService,private commonservice:CommonService){
  

  }

  ngOnInit(){
    this.registerForm = this.formBuilder.group({
      mid: ['', [Validators.required]],
      password: ['', [Validators.required]]
  });
  }
 
  obj:any;
login(form){
  
  if (this.registerForm.invalid) {
    console.log("hii");
    this.submittedError = true;
    return;
}
this.submittedError = false;
console.log(this.registerForm.value);
  this.obj={
    mid:this.registerForm.value.mid,
    password:this.registerForm.value.password
  }
 
  this.commonservice.memlogin(this.obj);

}
}
















//  ngOnInit() {}

// }