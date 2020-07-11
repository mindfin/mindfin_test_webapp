import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import {MatDialog,MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material';




@Component({
  selector: 'app-home',
  templateUrl: './disburselist.component.html',
})
export class DisburselistComponent  {

  constructor(private route:ActivatedRoute, private router:Router,public dialog: MatDialog,
    private commonservice:CommonService) {		
    }
  
  
fetchData:any;
percentage:any;
model:any={};
id1:any;
  ngOnInit() {
    // this.route.params.subscribe(params => {
    //     console.log(params) //log the entire params object
    //     console.log(params['id']) //log the value of id
    //   });
    // this.id1=params['id'];
     this.commonservice.getDisburseCustomerList().subscribe(res=>{
    console.log(res);
    this.fetchData = res;
    });
// })
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
console.log(obj)
this.id1=obj;
    this.model=element;
    
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {element};
      dialogConfig.data = this.id1;

       this.dialog.open(Empdialog1Content,dialogConfig
    );
    console.log(dialogConfig );
    }

    openDialog1(element,obj) {
      console.log(obj)
      this.id1=obj;
          this.model=element;
          
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {element};
            dialogConfig.data = this.id1;
      
             this.dialog.open(Empdialog2Content,dialogConfig
          );
          console.log(dialogConfig );
          }
refresh(): void {
  window.location.reload();
}

 }

 @Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'exedialog1-content.html',
  })
  
  export class Empdialog1Content{ 
  
    constructor(@Inject(MAT_DIALOG_DATA) public data:any,
    private route:ActivatedRoute, private router:Router,private service:CommonService) {}

id:any={};
model:any={};

  ngOnInit() {

}

   savechanges(model){
console.log(model);
console.log(this.data);
 this.model.id=this.data;
   this.service.addPayOut(model)
   .subscribe(res=>{
       console.log(res);
   })
   }
  
   refresh(): void {
    window.location.reload();
  }


  }
  @Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'exedialog2-content.html',
  })
  
  export class Empdialog2Content{ 
  
    constructor(@Inject(MAT_DIALOG_DATA) public data:any,
    private route:ActivatedRoute, private router:Router,private service:CommonService) {}

id:any={};
dd:any={};

  ngOnInit() {
console.log(this.data);
this.service.gettranscationdata(this.data).subscribe(res=>{
console.log(res);
this.dd=res;
// if(res==[]||res==undefined||res==null||res==''){
// console.log("hi");
// }else{
//   console.log("bye");
//   this.dd=res;
// }
// this.model=res[0];
})
}

//    savechanges(model){
// console.log(model);
// console.log(this.data);
// //  this.model.id=this.data;
//    this.service.addPayOut(model)
//    .subscribe(res=>{
//        console.log(res);
//    })
//    }
  
   refresh(): void {
    window.location.reload();
  }


  }