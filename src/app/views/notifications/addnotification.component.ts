import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../common.service';
import { DefaultLayoutComponent } from '../../containers';


class FileSnippet {
  static readonly IMAGE_SIZE = { width: 950, height: 720 };
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {
  }
}



@Component({
  selector: 'app-backend',
  templateUrl: './addnotification.component.html',
})
export class AddNotificationComponent implements OnInit {
  model: any = {};
  model1: any = {};
  empid: any;
  fetchData: any;
  fetchData1: any;
  fetchData2: any;
  fetchData3: any;
  fetchData4: any;
  fetchData5: any;
  fetchData6: any;
  myControl = new FormControl();
  val: any = [];
  empname: any;
  listing: any;
  listingData: any;
  show = false;
  hide = false;
  addListing = false;
  sendDeleteListingData: any;
  cimageUploadPath: any;
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

  constructor(private route: ActivatedRoute, private router: Router,
    private commonservice: CommonService, public defaultlayout: DefaultLayoutComponent,
  ) { }
  isCollapsed: boolean = false;


  ngOnInit() {
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");

    this.commonservice.getemployee().subscribe(res => {
      this.fetchData = [];
      // console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData.push(res[i]);
        }
      }
    });
    this.commonservice.getexecutivelist().subscribe(res => {
      this.fetchData1 = [];
      // console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData1.push(res[i]);
        }
      }
    });
    this.commonservice.getteleemp().subscribe(res => {
      this.fetchData2 = [];
      // console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData2.push(res[i]);
        }
      }
    });
    this.commonservice.getbackendemp().subscribe(res => {
      this.fetchData3 = [];
      // console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData3.push(res[i]);
        }
      }
    });
    this.commonservice.getaccemp().subscribe(res => {
      this.fetchData4 = [];
      // console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData4.push(res[i]);
        }
      }
    });
    this.commonservice.getloginexecutivelist().subscribe(res => {
      this.fetchData5 = [];
      // console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData5.push(res[i]);
        }
      }
    });
    this.commonservice.getdataentrtemp().subscribe(res => {
      this.fetchData6 = [];
      // console.log(res);
      for (var i = 0; i < Object.keys(res).length; i++) {
        if (res[i].iduser != null) {
          this.fetchData6.push(res[i]);
        }
      }
    });

  }

  public onFileSelect(event) {
    // this.processFile(event)
    let formData = new FormData();
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log(this.currentFileUpload);
    formData.append('cimageUpload', this.currentFileUpload, this.currentFileUpload.name);
    this.imagePath = formData;
    console.log(this.imagePath);
    this.imageChangeFlag = true;
    this.commonservice.uploadImage(this.imagePath).subscribe(
      async (data) => {
        this.cimageUploadPath = await this.getImageURL(data)
        console.log(this.cimageUploadPath);

      }
    )
  }
  async getImageURL(data) {
    return this.imageURL = await data.imageUrl;
  }

  refresh(): void {
    window.location.reload();
  }
  individualNotification(value) {
    console.log(value)
    this.abc = this.model1.group.split(",", 2);
    this.value1 = {
      value: value, empid: this.empid, empname: this.empname
      , notificationImg: this.cimageUploadPath, abc: this.abc
    }
    this.commonservice.individualNotification(this.value1).subscribe(res => {
      console.log(res);
      this.refresh();
    })
  }
  
  generalNotification(value) {
    console.log(value)
    if (value.group == "All") {
      this.value1 = {
        value: value, empid: this.empid, empname: this.empname
        , notificationImg: this.cimageUploadPath, abc: this.fetchData
      }
    }
    if (value.group == "EXECUTIVE") {
      this.value1 = {
        value: value, empid: this.empid, empname: this.empname
        , notificationImg: this.cimageUploadPath, abc: this.fetchData1
      }
    }
    if (value.group == "TELECALLER") {
      this.value1 = {
        value: value, empid: this.empid, empname: this.empname
        , notificationImg: this.cimageUploadPath, abc: this.fetchData2
      }
    }
    if (value.group == "BACKEND") {
      this.value1 = {
        value: value, empid: this.empid, empname: this.empname
        , notificationImg: this.cimageUploadPath, abc: this.fetchData3
      }
    }
    if (value.group == "ACCOUNTANT") {
      this.value1 = {
        value: value, empid: this.empid, empname: this.empname
        , notificationImg: this.cimageUploadPath, abc: this.fetchData4
      }
    }
    if (value.group == "LOGIN") {
      this.value1 = {
        value: value, empid: this.empid, empname: this.empname
        , notificationImg: this.cimageUploadPath, abc: this.fetchData5
      }
    }
    if (value.group == "DATAENTRY") {
      this.value1 = {
        value: value, empid: this.empid, empname: this.empname
        , notificationImg: this.cimageUploadPath, abc: this.fetchData6
      }
    }
    this.commonservice.generalNotification(this.value1).subscribe(res => {
      console.log(res);
      this.refresh();
    })
  }
  
}
