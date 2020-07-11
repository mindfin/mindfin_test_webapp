import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../member.service';

class FileSnippet {
  static readonly IMAGE_SIZE = { width: 950, height: 720 };
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {
  }
}
@Component({
  selector: 'app-backend',
  templateUrl: './documentcam.component.html',
})
export class DocumentCamComponent implements OnInit {
  model: any = {};
  listing: any;
  listingData: any;
  show = false;
  hide = false;
  addListing = false;
  sendDeleteListingData: any;
  filePath: any;
  filePath1: any;
  selectedFiles: any;
  selectedFiles1: any;
  currentFileUpload: any;
  imagePath: any;
  selectedFile: FileSnippet;
  imageChangedEvent: any;
  errorMessage: any = '';
  imageChangeFlag: boolean = false;
  imageURL: string;
  imageURL$: string;
  myfields: any = [];

 converteddbankstatement:any;
  getdoctype: any;
  value1: any;

  myform: FormGroup = new FormGroup({
    // name: new FormControl(null, [Validators.required]),
    value: new FormControl(null)
  });

  constructor(private route: ActivatedRoute, private router: Router, private commonservice: MemberService) { }

  ngOnInit() {

  }

  public onFileSelect(event) {
    let formData = new FormData();
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log(this.currentFileUpload);
    formData.append('image', this.currentFileUpload, this.currentFileUpload.name);
    this.imagePath = formData;
    console.log(this.imagePath);
    this.imageChangeFlag = true;
    this.commonservice.uploadImage(this.imagePath).subscribe(
      async (data) => {
        this.filePath = await this.getImageURL(data)
        console.log(this.filePath);
      }
    )
  }
  public onFileSelect1(event) {
    let formData = new FormData();
    this.selectedFiles1 = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log(this.currentFileUpload);
    formData.append('image', this.currentFileUpload, this.currentFileUpload.name);
    this.imagePath = formData;
    console.log(this.imagePath);
    this.imageChangeFlag = true;
    this.commonservice.uploadImage(this.imagePath).subscribe(
      async (data) => {
        this.filePath1 = await this.getImageURL(data)
        console.log(this.filePath);
      }
    )
  }
  async getImageURL(data) {
    return this.imageURL = await data.imageUrl;
  }

  submitForm(value) {
    console.log(value);
    localStorage.setItem("doctype", value.documenttype);
    this.getdoctype = localStorage.getItem("doctype");
    if (this.getdoctype == 'bankstatement') {
      this.value1 = { bankstatement: this.filePath };
      this.commonservice.bankstatementcam(this.value1)
      .subscribe(res => {
        console.log(res)
        this.converteddbankstatement=res;
        console.log(this.converteddbankstatement)
        
      })
    }
    else if(this.getdoctype=="itr"){
      this.value1 = { previousitr: this.filePath, currentitr:this.filePath1 };
      this.commonservice.itrcam(this.value1)
    }
  }

  refresh(): void {
    window.location.reload();
  }
  

}
