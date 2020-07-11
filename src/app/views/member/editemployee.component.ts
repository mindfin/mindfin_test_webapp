import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperadminService } from '../../superadmin.service';
import { CommonService } from '../../common.service';

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
  templateUrl: './editemployee.component.html',
})

export class EditemployeeComponent {
  constructor(private route: ActivatedRoute, private router: Router, private service: SuperadminService, private commonservice: CommonService) { }
  model: any = {};
  fetchData: any;
  fetchData1: any;
  fetchData2: any;
  dob: any;
  value1: any;
  ciimage: any;
  idvalue: any;
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
  appiletterPath:any;
  selectedFiles: any;
  currentFileUpload: any;
  imagePath: any;
  selectedFile: FileSnippet;
  imageChangedEvent: any;
  errorMessage: any = '';
  imageChangeFlag: boolean = false;
  imageURL: string;
  imageURL$: string;
  createdby: any;
  myfields: any = [];
  appletter:any


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idvalue = params['id'];

      this.commonservice.editemp(params['id']).subscribe(res => {
        console.log(res);
        this.model = res[0];
        this.model.iduser = this.model['idemployee'];
        console.log(this.model.iduser);
        console.log(this.model.appointmentLetter);
        localStorage.setItem('appointmentletter',this.model.appointmentLetter)
        this.appletter= localStorage.getItem("appointmentletter")
      });
    })

    this.commonservice.getuserlist().subscribe(res => {
      console.log(res);
      this.fetchData = res;
    });
  }
  checkcurrent(email) {
    console.log(email);
    this.commonservice.checkcurrent(email).subscribe(res => {
      console.log(res['status']);
      this.model.status = res['status'];
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
  public onFileSelect3(event) {
    // this.processFile(event)
    let formData = new FormData();
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log(this.currentFileUpload);
    formData.append('appointment', this.currentFileUpload, this.currentFileUpload.name);
    this.imagePath = formData;
    console.log(this.imagePath);
    this.imageChangeFlag = true;
    this.commonservice.uploadImage(this.imagePath).subscribe(
      async (data) => {
        this.appiletterPath = await this.getImageURL(data)
        console.log(this.appiletterPath);
      }
    )
  }
  async getImageURL(data) {
    return this.imageURL = await data.imageUrl;
  }

  submitForm(value) {
    console.log(value);
    this.createdby = localStorage.getItem("id")
    this.value1 = {
      value: value, createdby: this.createdby, idemployeee: this.idvalue,
      cimg: this.cimagfilePath, pimg: this.pimagfilePath, aimg: this.aimagfilePath,
      appletimg:this.appiletterPath
    };
    console.log(this.value1);
    this.commonservice.editemployee(this.value1);
    this.router.navigate(["/member/employeelist"]);
  }

  refresh(): void {
    window.location.reload();
  }
}