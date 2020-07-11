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
  templateUrl: './editbackend.component.html',
  // styleUrls: ['./addadmin.component.scss']
})
export class EditBackendComponent implements OnInit {



  constructor(private route: ActivatedRoute, private router: Router, private commonservice: CommonService) { }

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



  ngOnInit() {
    this.commonservice.getexecutivelist().subscribe(res => {
      this.fetchData = [];
      console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData.push(res[i]);
        }
      }
    });
    this.route.params.subscribe(params => {
      this.empid = params['id'];

      this.commonservice.backendeditemp(params['id']).subscribe(res => {
        console.log(res);
        this.model = res[0];
        this.model.idbackend = this.model['idbackend'];
        console.log(this.model.idbackend);
      });
    })
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
    this.empid1 = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    // this.abc = this.model.idexecutive.split(",", 2);
    this.value1 = {
      value: value, empid: this.empid1, empname: this.empname, custid: this.empid,
      companykyc: this.companykycPath, customerkyc: this.customerkycPath, itr: this.itrPath,
      bankstatement: this.bankstatementPath, loanstatement: this.loanstatementPath,
      gstandreturns: this.gstandreturnsPath,applicationDetails:this.applicationdetailPath
    };
    console.log(this.value1);
    this.commonservice.editcustdoc(this.value1)
      .subscribe(res => {
        // window.location.reload();
        this.router.navigate(["/backend/viewdocument"]);
      })
  }
  refresh(): void {
    window.location.reload();
  }

}
