import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';


class FileSnippet {
  static readonly IMAGE_SIZE = { width: 950, height: 720 };
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {
  }
}

export interface User {
name: string;
  }
@Component({
  templateUrl:'./editcustomers.component.html',
})

export class EditcustomersComponent {

constructor(private route: ActivatedRoute,private router:Router,private service:SuperadminService,private commonservice: CommonService){}
tempval:any;
array:any=[];
array1:any=[];
fetchData1:any;
fetchData2:any;
fetchData5:any;
fetchData6:any;
dob:any;
idvalue;
tempval1:any;
tempval2:any;
vvv:any;
loantype:any;
loancatg:any;
sourcetype:any;
obj: any;
fetchData: any;
model: any = {};
myControl = new FormControl();
val: any = [];
empid: any;
empid1: any;
empname: any;
listing: any;
listingData: any;
show = false;
hide = false;
addListing = false;
sendDeleteListingData: any;
companykycPath: any;
customerkycPath: any;
itrPath: any;
bankstatementPath: any;
loanstatementPath: any;
gstandreturnsPath: any;
applicationdetailPath:any;
selectedFiles: any;
currentFileUpload: any;
imagePath: any;
selectedFile: FileSnippet;
imageChangedEvent: any;
errorMessage: any = '';
imageChangeFlag: boolean = false;
imageURL: string;
imageURL$: string;
myfields: any = [];
value1: any;
abc: any;
// options: User[] = this.val;
// filteredOptions: Observable<User[]>;

ngOnInit() {
  this.empid = localStorage.getItem("id");
  this.empname = localStorage.getItem("empname");
  this.route.params.subscribe(params=>{
    console.log(params['id']);
    this.idvalue = params['id'];
    this.commonservice.editcust(params['id']).subscribe(res => {
      console.log(res);
      this.model=res[0];
    });
  })
  this.commonservice.getcocustomer(this.idvalue).subscribe(res=>{
    console.log(res);
    this.tempval2=res;
    });
  this.commonservice.getloanlist().subscribe(res=>{
    console.log(res);
    this.fetchData = res;
  });
  this.commonservice.getemployeetypelist().subscribe(res=>{
    this.fetchData6=res;
  });

  this.commonservice.getexecutivelist().subscribe(res=>{
    this.fetchData1 = [];
    console.log(res);
    for(var i=0;i<Object.keys(res).length;i++){
      if(res[i].iduser!=null){
      this.fetchData1.push(res[i]);
      }
    }
  });
  this.commonservice.getvendornames()
  .subscribe(res=>{
    // console.log(this.array);
    console.log(res);
    this.fetchData5=res;
  })

  this.commonservice.getbanklist().subscribe(res=>{
    console.log(res);
    this.fetchData2 = res;
  });

}

onChange(event){
  console.log(event);
 this.loantype= event
}
onChange1(event){
  console.log(event);
 this.loancatg= event
}
onChange2(event){
  console.log(event);
 this.sourcetype= event
}
removevalue(pro,index)
  {
    console.log(index);
    this.array.splice(index,1);

  }
  editcocust(pro){
    console.log(pro);
  this.commonservice.editcocust(pro)
  .subscribe(res=>{
    // console.log(res);
    this.refresh();
  })
  }
orgValueChange(date){
  //console.log('');
  this.dob=date;
}


displayFn(user?: User): string | undefined {
  return user ? user.name : undefined;
  
}

public onFileSelect(event) {
  // this.processFile(event)
  let formData = new FormData();
  this.selectedFiles = event.target.files;
  this.currentFileUpload = this.selectedFiles.item(0);
  console.log(this.currentFileUpload);
  formData.append('Companykyc', this.currentFileUpload, this.currentFileUpload.name);
  this.imagePath = formData;
  console.log(this.imagePath);
  this.imageChangeFlag = true;
  this.commonservice.uploadImage(this.imagePath).subscribe(
    async (data) => {
      this.companykycPath = await this.getImageURL(data)
      console.log(this.companykycPath);
    }
  )
}
public onFileSelect1(event) {
  // this.processFile(event)
  let formData = new FormData();
  this.selectedFiles = event.target.files;
  this.currentFileUpload = this.selectedFiles.item(0);
  console.log(this.currentFileUpload);
  formData.append('customerkyc', this.currentFileUpload, this.currentFileUpload.name);
  this.imagePath = formData;
  console.log(this.imagePath);
  this.imageChangeFlag = true;
  this.commonservice.uploadImage(this.imagePath).subscribe(
    async (data) => {
      this.customerkycPath = await this.getImageURL(data)
      console.log(this.customerkycPath);
    }
  )
}
public onFileSelect2(event) {
  // this.processFile(event)
  let formData = new FormData();
  this.selectedFiles = event.target.files;
  this.currentFileUpload = this.selectedFiles.item(0);
  console.log(this.currentFileUpload);
  formData.append('itr', this.currentFileUpload, this.currentFileUpload.name);
  this.imagePath = formData;
  console.log(this.imagePath);
  this.imageChangeFlag = true;
  this.commonservice.uploadImage(this.imagePath).subscribe(
    async (data) => {
      this.itrPath = await this.getImageURL(data)
      console.log(this.itrPath);
    }
  )
}
public onFileSelect3(event) {
  // this.processFile(event)
  let formData = new FormData();
  this.selectedFiles = event.target.files;
  this.currentFileUpload = this.selectedFiles.item(0);
  console.log(this.currentFileUpload);
  formData.append('bankstatement', this.currentFileUpload, this.currentFileUpload.name);
  this.imagePath = formData;
  console.log(this.imagePath);
  this.imageChangeFlag = true;
  this.commonservice.uploadImage(this.imagePath).subscribe(
    async (data) => {
      this.bankstatementPath = await this.getImageURL(data)
      console.log(this.bankstatementPath);
    }
  )
}
public onFileSelect4(event) {
  // this.processFile(event)
  let formData = new FormData();
  this.selectedFiles = event.target.files;
  this.currentFileUpload = this.selectedFiles.item(0);
  console.log(this.currentFileUpload);
  formData.append('loanstatement', this.currentFileUpload, this.currentFileUpload.name);
  this.imagePath = formData;
  console.log(this.imagePath);
  this.imageChangeFlag = true;
  this.commonservice.uploadImage(this.imagePath).subscribe(
    async (data) => {
      this.loanstatementPath = await this.getImageURL(data)
      console.log(this.loanstatementPath);
    }
  )
}
public onFileSelect5(event) {
  // this.processFile(event)
  let formData = new FormData();
  this.selectedFiles = event.target.files;
  this.currentFileUpload = this.selectedFiles.item(0);
  console.log(this.currentFileUpload);
  formData.append('gstandreturns', this.currentFileUpload, this.currentFileUpload.name);
  this.imagePath = formData;
  console.log(this.imagePath);
  this.imageChangeFlag = true;
  this.commonservice.uploadImage(this.imagePath).subscribe(
    async (data) => {
      this.gstandreturnsPath = await this.getImageURL(data)
      console.log(this.gstandreturnsPath);
    }
  )
}
public onFileSelect6(event) {
  // this.processFile(event)
  let formData = new FormData();
  this.selectedFiles = event.target.files;
  this.currentFileUpload = this.selectedFiles.item(0);
  console.log(this.currentFileUpload);
  formData.append('applicationdetails', this.currentFileUpload, this.currentFileUpload.name);
  this.imagePath = formData;
  console.log(this.imagePath);
  this.imageChangeFlag = true;
  this.commonservice.uploadImage(this.imagePath).subscribe(
    async (data) => {
      this.applicationdetailPath = await this.getImageURL(data)
      console.log(this.applicationdetailPath);
    }
  )
}
async getImageURL(data) {
  return this.imageURL = await data.imageUrl;
}

submitForm(value){
console.log(value);
this.vvv = {
  arr: this.array1,value:value,custid:this.idvalue,empid: this.empid, empname: this.empname,
  companykyc: this.companykycPath, customerkyc: this.customerkycPath, itr: this.itrPath,
  bankstatement: this.bankstatementPath, loanstatement: this.loanstatementPath,
  gstandreturns: this.gstandreturnsPath,applicationDetails:this.applicationdetailPath
}
this.commonservice.customerupdate(this.vvv).subscribe(res=>{
  this.router.navigate(["/members/viewcustomer"]);
})


}
redirect(){
  this.router.navigate(["/members/viewcustomer"]);
}
refresh(){
    window.location.reload();
  }
  clearFilters(){
    this.model.coname='';
    this.model.copaddress='';
    this.model.coraddress='';
  }
  addvalues1(){
    this.array1.push({
      coname:this.model.coname,
      copaddress:this.model.copaddress,
      coraddress:this.model.coraddress
    })
    console.log(this.array1);
    this.tempval1=this.array1;
  }
}