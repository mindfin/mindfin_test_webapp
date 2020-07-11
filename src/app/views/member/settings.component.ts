import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../common.service';

@Component({
    templateUrl:'./settings.component.html',
})
export class SettingsComponent{
    constructor(private http:HttpClient,private formBuilder:FormBuilder,private service:CommonService) { }
    selectedFile = null;
    editIndex = null;
    registerForm: FormGroup;
    presidentname : String;
    image:any;
    submittedError;
    model: any = {};
    ngOnInit() {
        this.service.settingslist().
        subscribe(res=>{
            console.log(res);
            this.model=res[0];
        })
      }
    refresh(){
        window.location.reload();
    }

  
    leftselect(event)
    {
      this.image = <File>event.target.files[0];
      console.log(this.image);
  
    }
  

    onSubmit(){
      console.log(this.model);
      const fd=new FormData();

    //   if(this.selectedFile!=null){
    //     fd.append('cimage',this.selectedFile,this.selectedFile.name);
    //    }
    //    else
    //    {
    //     fd.append('cimage',this.model.cimage);
    //    }



      if(this.image!=null){
      fd.append('leftimg',this.image,this.image.name);
      }
      else{
        fd.append('leftimg',this.model.image); 
      }
      fd.append('emailpassword',this.model.emailpassword);  
      fd.append('emailuser',this.model.emailuser);  
      fd.append('fromemail1',this.model.fromemail1);  
      fd.append('fromemail2',this.model.fromemail2);  
      fd.append('hostmail',this.model.hostmail);  
      fd.append('mloginlink',this.model.mloginlink);  
      fd.append('subject',this.model.subject); 
      fd.append('idsetting',this.model.idsetting);  
      fd.append('regards',this.model.regards);  
      fd.append('cc',this.model.cc);  
      fd.append('bcc',this.model.bcc);  
      fd.append('bsubject',this.model.bsubject);  
      fd.append('address',this.model.address);  
      this.service.settings(fd);
    }
   
}