import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { FormControl } from '@angular/forms';
class FileSnippet {
  static readonly IMAGE_SIZE = { width: 950, height: 720 };
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {
  }
}
@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
})
export class BackendComponent implements OnInit {


  constructor(private route: ActivatedRoute, private router: Router, private commonservice: CommonService) { }

  obj: any;
  fetchData: any;
  fetchData1: any;
  fetchData2: any;
  fetchData3: any;
  fetchData4: any;
  model: any = {};
  myControl = new FormControl();
  val: any = [];
  empid: any;
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
  applicationdetailPath: any;
  selectedFiles: any;
  selectedFiles1: any;
  selectedFiles2: any;
  selectedFiles3: any;
  selectedFiles4: any;
  selectedFiles5: any;
  selectedFiles6: any;
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
  abc:any;
  array:any=[];
  array1:any=[];
  tempval1:any;
  loantype:any;
  loancatg:any;
  sourcetype:any;
  branch:any;
  ngOnInit() {
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    
    this.branch=localStorage.getItem('branch')
    this.commonservice.getheadofficeEmployee().subscribe(res => {
      this.fetchData4 = [];
      console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData4.push(res[i]);
        }
      }
    });
    
    this.commonservice.getloanlist().subscribe(res=>{
      console.log(res);
      this.fetchData2 = res;
    });
    this.commonservice.getemployeetypelist().subscribe(res=>{
      this.fetchData3=res;
    });
    this.commonservice.getallexecutivelist().subscribe(res=>{
    this.fetchData1 = [];
    console.log(res);
    for(var i=0;i<Object.keys(res).length;i++){
      if(res[i].iduser!=null){
      this.fetchData1.push(res[i]);
    }
  }
});}
  addvalues1()
  {
    this.array1.push({
      coname:this.model.coname,
      copaddress:this.model.copaddress,
      coraddress:this.model.coraddress
    })
    console.log(this.array1);
    this.tempval1=this.array1;
  }
  clearFilters()
  {
    this.model.coname='';
    this.model.copaddress='';
    this.model.coraddress='';
  }
  removevalue(pro,index)
  {
    console.log(index);
    this.array1.splice(index,1);
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
  pan_validate(value){
    console.log(value)
    var regpan = /[A-Z]{3}[PCHFATBLJG]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/;
    if (regpan.test(value)) {
      this.model.pancheck = "true" ;
    } else {
      this.model.pancheck = "false";
    }
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

  submitForm(value) {
    console.log(value);
    
    this.abc = this.model.idexecutive.split(",", 2);
    this.value1 = {
      value: value, empid: this.empid, empname: this.empname, abc: this.abc,
      companykyc: this.companykycPath, customerkyc: this.customerkycPath, itr: this.itrPath,
      bankstatement: this.bankstatementPath, loanstatement: this.loanstatementPath,
      gstandreturns: this.gstandreturnsPath,applicationDetails:this.applicationdetailPath, arr: this.array1
    };
    console.log(this.value1);
    this.commonservice.custdocument(this.value1)
      .subscribe(res => {
        this.router.navigate(["/members/viewcustomer"]);
      })
  }
  refresh(): void {
    window.location.reload();
  }

}
