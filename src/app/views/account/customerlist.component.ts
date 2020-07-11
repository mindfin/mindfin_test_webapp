import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import {MatDialog,MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material';




@Component({
  selector: 'app-home',
  templateUrl: './customerlist.component.html',
})
export class CustomerlistComponent  {

  constructor(private route:ActivatedRoute, private router:Router,public dialog: MatDialog,
    private commonservice:CommonService) {		
    }
  
  
fetchData:any;
percentage:any;
model:any={};
id1:any;
  ngOnInit() {
    this.route.params.subscribe(params => {
    //     console.log(params) //log the entire params object
    //     console.log(params['id']) //log the value of id
    //   });
    // this.id1=params['id'];
     this.commonservice.getSubvendorCustomerList(params['id']).subscribe(res=>{
    console.log(res);
    this.fetchData = res;
    });
})
  }

 customerList(obj){

    //  console.log(obj)
     this.commonservice.CustomerList(obj);
    //  .subscribe(res=>{
    //      console.log(res);
    //  })
 }
save(obj,obj1){
    console.log(obj);
    console.log(obj1);
    obj.percentage=obj1;
   this.commonservice.savePayout(obj).subscribe(res=>{
    console.log(res);
})

}
openDialog(element,obj) {
console.log(obj);
    this.model=element;
       const dialogConfig = new MatDialogConfig();
       dialogConfig.data = {element};
       dialogConfig.data = obj;
       this.dialog.open(EmpdialogContent,dialogConfig
     
      
    );
    console.log(dialogConfig );
    
    }
refresh(): void {
  window.location.reload();
}

// savechanges(bankname,payout){
//     console.log(bankname,payout);
//     }



 }
//  import { ActivatedRoute, Router } from '@angular/router';

 @Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'exedialog-content.html',
  })
  
  export class EmpdialogContent{ 
  
    constructor(@Inject(MAT_DIALOG_DATA) public data:any,
    private route:ActivatedRoute, private router:Router,private service:CommonService) {}

id:any;
model:any={};
dd:any={};

  ngOnInit() {
this.service.getApproveBankList(this.data).subscribe(res=>{
  console.log(res);
  this.dd=res;
})
console.log(this.data)

}

   savechanges(model){

     console.log(model);
    this.model.id=this.data;
    this.service.addPayOut(model)
    .subscribe(res=>{
    console.log(res);

   })
   }
  getpayout(obj){
    console.log(obj);
  }
savepayout(obj){
  console.log(obj);
  this.service.savePayout(obj).subscribe(res=>{
    console.log(res);
  })
}


  }