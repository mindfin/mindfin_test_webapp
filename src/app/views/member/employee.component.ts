import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';
import { Router } from '@angular/router';
// var sha1 = require('sha1');

export interface User {
  name: string;
}
class FileSnippet {
  static readonly IMAGE_SIZE = { width: 950, height: 720 };
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {
  }
}
@Component({
  templateUrl: './employee.component.html',
})
export class EmployeeComponent {
  constructor(private service: SuperadminService, private commonservice: CommonService, private router: Router) { }

  model: any = {};
  fetchData: any;
  fetchData1: any;
  fetchData2: any;
  dob: any;
  createdby: any;
  value1: any;
  myControl = new FormControl();
  val: any = [];
  listing: any;
  listingData: any;
  show = false;
  hide = false;
  addListing = false;
  sendDeleteListingData: any;
  cimagfilePath: any;
  pimagfilePath: any;
  aimagfilePath: any;
  selectedFiles: any;
  selectedFiles1: any;
  selectedFiles2: any;
  currentFileUpload: any;
  imagePath: any;
  selectedFile: FileSnippet;
  imageChangedEvent: any;
  errorMessage: any = '';
  imageChangeFlag: boolean = false;
  imageURL: string;
  imageURL$: string;
  myfields: any = [];
fetchData3:any;
fetchData4:any;
  ngOnInit() {
    this.commonservice.getuserlist().subscribe(res => {
      console.log(res);
      this.fetchData = res;
    });
    this.commonservice.getpasswords().subscribe(res=>{
      console.log(res);
      this.fetchData3 =res;

    })
    this.commonservice.getemailSettings().subscribe(res=>{
      console.log(res);
      this.fetchData4 =res;

    })
  }
  orgValueChange(date) {
    this.dob = date;
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
    formData.append('cimage', this.currentFileUpload, this.currentFileUpload.name);
    this.imagePath = formData;
    console.log(this.imagePath);
    this.imageChangeFlag = true;
    this.commonservice.uploadImage(this.imagePath).subscribe(
      async (data) => {
        this.cimagfilePath = await this.getImageURL(data)
        console.log(this.cimagfilePath);
      }
    )
  }
  public onFileSelect1(event) {
    // this.processFile(event)
    let formData = new FormData();
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log(this.currentFileUpload);
    formData.append('pimage', this.currentFileUpload, this.currentFileUpload.name);
    this.imagePath = formData;
    console.log(this.imagePath);
    this.imageChangeFlag = true;
    this.commonservice.uploadImage(this.imagePath).subscribe(
      async (data) => {
        this.pimagfilePath = await this.getImageURL(data)
        console.log(this.pimagfilePath);
      }
    )
  }
  public onFileSelect2(event) {
    // this.processFile(event)
    let formData = new FormData();
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log(this.currentFileUpload);
    formData.append('aimage', this.currentFileUpload, this.currentFileUpload.name);
    this.imagePath = formData;
    console.log(this.imagePath);
    this.imageChangeFlag = true;
    this.commonservice.uploadImage(this.imagePath).subscribe(
      async (data) => {
        this.aimagfilePath = await this.getImageURL(data)
        console.log(this.aimagfilePath);
      }
    )
  }
  async getImageURL(data) {
    return this.imageURL = await data.imageUrl;
  }
  
  submitForm(value) {
    console.log(value);
    this.createdby = localStorage.getItem("id")
    this.value1 = { value: value, createdby: this.createdby,
       cimg: this.cimagfilePath, pimg: this.pimagfilePath, aimg: this.aimagfilePath,
       password:this.fetchData3,emails:this.fetchData4
      };
    console.log(this.value1);
    this.commonservice.employeeadd(this.value1)
      .subscribe(res => {
        this.router.navigate(["/member/employeelist"]);
      })
  }

  refresh(): void {
    window.location.reload();
  }

  checkcurrent(email) {
    console.log(email);
    this.commonservice.checkcurrent(email).subscribe(res => {
      console.log(res['status']);
      this.model.status = res['status'];
    })
  }
}