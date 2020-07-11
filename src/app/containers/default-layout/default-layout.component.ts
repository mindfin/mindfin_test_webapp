import { Component, Input, Inject } from '@angular/core';
import { navItems } from './../../_nav';
import { navItems1 } from './../../_nav1';
import { navItems2 } from './../../_nav2';
import { navItems3 } from './../../_nav3';
import { navItems4 } from './../../_nav4';
import { navItems5 } from './../../_nav5';
import { navItems6 } from '../../_nav6';
import { navItems7 } from '../../_nav7';
import { Router, ActivatedRoute } from '@angular/router';
import { any } from 'bluebird';
import { CommonService } from '../../common.service';
import { navItems8 } from '../../_nav8';
import { navItems9 } from '../../_nav9';
import { navItems10 } from '../../_nav10';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';

class FileSnippet {
  static readonly IMAGE_SIZE = { width: 950, height: 720 };
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public abc = localStorage.getItem('role');
  public isadmin = localStorage.getItem('desc');
  public navItems = navItems;
  public navItems1 = navItems1;
  public navItems2 = navItems2;
  public navItems3 = navItems3;
  public navItems4 = navItems4;
  public navItems5 = navItems5;
  public navItems6 = navItems6;
  public navItems7 = navItems7;
  public navItems8 = navItems8;
  public navItems9 = navItems9;
  public navItems10 = navItems10;

  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  memberid: any;
  fetchData;
  fetchData1;
  fetchData2;
  fetchData3;
  fetchData4;
  fetchData5;
  fetchData6;
  fetchData7;
  fetchData8;
  fetchData9;
  fetchData10;
  fetchData11;
  fetchData12;
  fetchData13;
  fetchData14;
  fetchData15;
  fetchData16;
  fetchData17;
  fetchData18;
  fetchData19;
  fetchData20;
  fetchData21;
  fetchData22;
  fetchData23;
  fetchData24;
  fetchData25;
  fetchData26;
  fetchData27;
  fetchData28;
  fetchData29;
  fetchData30;
  fetchData31;
  reason;
  half;
  other;
  from;
  to;
  currentPage = 1;
  postsPerPage = 5;
  pageSizeOptions = [5, 10, 20];
  comment;
  val: any;

  constructor(private router: Router, private service: CommonService, private dialog: MatDialog) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });
    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["login"]);
  }

  ngOnInit() {
    this.memberid = localStorage.getItem("id");
    this.service.getemployeename(this.memberid).subscribe(res => {
      this.fetchData = res[0];
    });

    this.service.gettopleave(this.postsPerPage, this.currentPage, this.memberid).subscribe(res => {
      this.fetchData1 = res;
    });
    this.service.gettopconven(this.postsPerPage, this.currentPage, this.memberid).subscribe(res => {
      this.fetchData2 = res;
    });
    this.service.gettopsug(this.postsPerPage, this.currentPage, this.memberid).subscribe(res => {
      this.fetchData3 = res;
    });
    this.service.getsugpending().subscribe(res => {
      this.fetchData4 = res;
    });
    this.service.getconvpending().subscribe(res => {
      this.fetchData5 = res;
    });
    this.service.getleaveapp().subscribe(res => {
      this.fetchData6 = res;
    });
    this.service.getweblead().subscribe(res => {
      this.fetchData7 = res;
    });
    this.val = { empid: this.memberid }
    this.service.getnewtelcount(this.val).subscribe(res => {
      this.fetchData11 = res;
    });
    
    this.service.getnewappocount(this.val).subscribe(res => {
      this.fetchData10 = res;
    });
    this.service.getnewnotification(this.val).subscribe(res => {
      this.fetchData12 = res;
    });
    this.service.gettodolist(this.val).subscribe(res => {
      this.fetchData13 = res;
    });
    this.service.getearlygocount().subscribe(res => {
      this.fetchData8 = res;
      // console.log(this.fetchData9 = this.fetchData6 + this.fetchData4 + this.fetchData5 + this.fetchData7 + this.fetchData8);
    });
    this.service.getvisitorcount().subscribe(res => {
      this.fetchData31 = res;
      this.fetchData9 = this.fetchData6 + this.fetchData4 + this.fetchData5 + this.fetchData7 + this.fetchData8+ this.fetchData31
      console.log(this.fetchData9);
    });
    this.service.notopenedlist(this.val).subscribe(res => {
      this.fetchData14 = res;
    }); this.service.filepickedlist(this.val).subscribe(res => {
      this.fetchData15 = res;
    }); this.service.contactedlist(this.val).subscribe(res => {
      this.fetchData16 = res;
    }); this.service.loginlist(this.val).subscribe(res => {
      this.fetchData17 = res;
    }); this.service.wiplist(this.val).subscribe(res => {
      this.fetchData18 = res;
    }); this.service.approvedlist(this.val).subscribe(res => {
      this.fetchData19 = res;
    });
    this.service.nofallowup(this.val).subscribe(res => {
      this.fetchData21 = res;
      this.fetchData20 = this.fetchData11 + this.fetchData14 + this.fetchData15 + this.fetchData16 +
        this.fetchData17 + this.fetchData18 + this.fetchData19+this.fetchData21
      console.log(this.fetchData20 );
    });
    this.service.getadminnewtelcount().subscribe(res => {
      this.fetchData22 = res;
    });
    this.service.adminnotopenedlist().subscribe(res => {
      this.fetchData23 = res;
    }); this.service.adminfilepickedlist().subscribe(res => {
      this.fetchData24 = res;
    }); this.service.admincontactedlist().subscribe(res => {
      this.fetchData25 = res;
    }); this.service.adminloginlist().subscribe(res => {
      this.fetchData26 = res;
    }); this.service.adminwiplist().subscribe(res => {
      this.fetchData27 = res;
    }); this.service.adminapprovedlist().subscribe(res => {
      this.fetchData28 = res;
    });
    this.service.adminnofallowup().subscribe(res => {
      this.fetchData29 = res;
      this.fetchData30 = this.fetchData22 + this.fetchData23 + this.fetchData24 + this.fetchData25 +
        this.fetchData26 + this.fetchData27 + this.fetchData28+this.fetchData29
      console.log(this.fetchData30);
    });
  }

  sugbox() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { reason: this.reason };
    this.dialog.open(SugboxDialogContent, dialogConfig
    );
    console.log(dialogConfig);

  }

  leaveapp() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { from: this.from, half: this.half, reason: this.reason };
    this.dialog.open(LeaveAppDialogContent, dialogConfig
    );
    console.log(dialogConfig);
  }
  convens() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { catgory: any, other: this.other, comment: this.comment };
    this.dialog.open(ConvenienceDialogContent, dialogConfig
    );
    console.log(dialogConfig);
  }
}

// Suggestion Box Component
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'sugbox_dialog.html',
})

export class SugboxDialogContent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private commonservice: CommonService, private route: ActivatedRoute, private router: Router,
    public dialogRef: MatDialogRef<SugboxDialogContent>) { }

  element: any;
  empid: any;
  empname: any;
  value1: any;
  model: any;
  fetchData:any;
  ngOnInit(){
    this.commonservice.getemailSettings().subscribe(res=>{
      console.log(res);
      this.fetchData =res;

    })
  }
  onSubmit(data) {
    console.log(data);
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    this.value1 = { value: data, empid: this.empid, empname: this.empname,emails:this.fetchData  };
    console.log(this.value1);
    this.commonservice.suggbox(this.value1)
      .subscribe(res => {
        alert("Suggestion / concern / complaint sent Successfully");

        this.dialogRef.close();
      })
  }
  refresh(): void {
    window.location.reload();
  }
}

// Leave Application component
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'leaveapp_dialog.html',
})

export class LeaveAppDialogContent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private commonservice: CommonService, private route: ActivatedRoute, private router: Router,
    public dialogRef: MatDialogRef<LeaveAppDialogContent>) { }
  element: any;
  empid: any;
  empname: any;
  value1: any;
  fetchData:any;
  ngOnInit(){
    this.commonservice.getemailSettings().subscribe(res=>{
      console.log(res);
      this.fetchData =res;

    })
  }
  onSubmit(value) {
    console.log(value);
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    this.value1 = { value: value, empid: this.empid, empname: this.empname,emails:this.fetchData };
    console.log(this.value1);
    this.commonservice.leaveapp(this.value1)
      .subscribe(res => {
        alert("Leave Application sent Successfully");
        this.dialogRef.close();
      })
  }
  refresh(): void {
    window.location.reload();
  }
}
// Conveniences Component
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'conven_dialog.html',
})

export class ConvenienceDialogContent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private commonservice: CommonService, private route: ActivatedRoute, private router: Router,
    public dialogRef: MatDialogRef<ConvenienceDialogContent>) { }
  listing: any;
  listingData: any;
  show = false;
  hide = false;
  addListing = false;
  sendDeleteListingData: any;
  filePath: any;
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

  element: any;
  empid: any;
  empname: any;
  value1: any;
  fetchData:any;
  ngOnInit(){
    this.commonservice.getemailSettings().subscribe(res=>{
      console.log(res);
      this.fetchData =res;

    })
  }
  public onFileSelect(event) {
    // this.processFile(event)
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
  async getImageURL(data) {
    return this.imageURL = await data.imageUrl;
  }


  onSubmit(value) {
    console.log(value);
    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    this.value1 = { value: value, empid: this.empid, empname: this.empname, catimg: this.filePath,emails:this.fetchData };
    console.log(this.value1);
    this.commonservice.conves(this.value1)
      .subscribe(res => {
        alert("Convenience sent Successfully");
        this.dialogRef.close();

      })
  }
  refresh(): void {
    window.location.reload();
  }
}