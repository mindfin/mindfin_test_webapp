import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { MatDialogConfig, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-addadmin',
  templateUrl: './custstatus.component.html',
//   styleUrls: ['./loantype.component.scss']
})
export class CustStatusComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router:Router,private service: CommonService,private dialog: MatDialog) { }

  
obj:any;
fetchData:any;
fetchData2:any;
model: any = {};
selectedFile;
bname:any;
idvalue:any;
vvv:any;
tempval:any;
array:any=[];
fetchData1:any;

  onSubmit(){
    this.service.bankinsert(this.model);
   }

  ngOnInit() {
   
  this.route.params.subscribe(params=>{
    this.idvalue = params['id'];
  });

  this.route.params.subscribe(params=>{
    console.log(params['id']);
    this.idvalue = params['id'];
 this.service.getbackendviewbanklist(this.idvalue).subscribe(res=>{
console.log(res);
this.fetchData1 = res;
});

})


  }
  refresh(): void {
    window.location.reload();
  }
  toggleEditable(event) {
    console.log(event.target.checked);
    console.log(event);

    var bagColor:string = '0';  
    for(var i=0;i<this.fetchData.length;i++){
      if(this.fetchData[i].status1==true){
        bagColor = bagColor + "," + "" + this.fetchData[i].idbank + "";
      }
    }
    console.log(bagColor);
     this.bname = bagColor;
  }
  addtenure(element){
    console.log("hii")
    this.service.viewbankk(element);
    }
  openDialog(element) {
    this.model=element;
    
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {element};
      this.dialog.open(RejectBankDialogContent,dialogConfig
    );
    console.log(dialogConfig );
    
    }
}
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog_rejectbankreason.html',
})

export class RejectBankDialogContent {
element:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private commonservice: CommonService ,private route: ActivatedRoute, private router: Router,) { }

  
  rejectbank(element,obj) {

    this.commonservice.rejectbank(element,obj);

  }
  refresh(): void {
    window.location.reload();
  }
}