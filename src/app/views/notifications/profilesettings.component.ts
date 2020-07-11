import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../common.service';
import { DefaultLayoutComponent } from '../../containers';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';


class FileSnippet {
  static readonly IMAGE_SIZE = { width: 950, height: 720 };
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {
  }
}



@Component({
  selector: 'app-backend',
  templateUrl: './profilesettings.component.html',
})
export class ProfileSettingComponent implements OnInit {
  model: any = {};
  empid: any;
  fetchData: any = {};
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
  
  // config: ExportAsConfig = {
  //   type: 'pdf',
  //   elementId: 'mytable',
  //   options: {
  //     jsPDF: {
  //       orientation: 'landscape'
  //     },
  //     pdfCallbackFn: this.pdfCallbackFn // to add header and footer
  //   }
  // };

  constructor(private route: ActivatedRoute, private router: Router,
    private commonservice: CommonService, public defaultlayout: DefaultLayoutComponent,
    // public exportAsService: ExportAsService
  ) { }
  isCollapsed: boolean = false;


  ngOnInit() {
    this.empid = localStorage.getItem("id");
    console.log(this.empid);

    this.commonservice.editemp(this.empid).subscribe(res => {
      console.log(res);
      this.fetchData = res[0];
      this.fetchData.iduser = this.fetchData['idemployee'];
      console.log(this.fetchData.iduser);
    });

  }
  downloadCount(value) {
    this.commonservice.downloadCount(value).subscribe(res => {
      console.log(res);
    })
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
        await this.cimageUpload(this.cimageUploadPath)

      }
    )
  }
  async getImageURL(data) {
    return this.imageURL = await data.imageUrl;
  }
  async cimageUpload(data) {
    this.value1 = { empid: this.model, cimgupload: data };
    this.commonservice.cimageUpload(this.value1).subscribe(res => {
      this.ngOnInit();
      this.defaultlayout.ngOnInit();
      return res;
    })
  }
  refresh(): void {
    window.location.reload();
  }
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
//   generate(value) {
  
    
//     console.log(value)
//     var doc = new jsPDF('l', 'pt');
//     // doc.addImage(imageData, "JPG", 10, 8, 100, 100);
//     doc.setFontSize(12);
//     doc.setTextColor(0);
//     doc.setFontStyle('bold');
//     // var base64Img = "http://mindfin.oss-ap-south-1.aliyuncs.com/logo.jpg";
//     // doc.addImage(base64Img, 'JPEG', 10, 10, 10, 10);
//     doc.text("This is computer generated payslip,no signature is required \n", 250, 500);
//     doc.text("In Words \n", 250, 250);
//     var data = this.getData(10, value);

//     doc.autoTable(this.getColumns(), data, {
//       theme: 'grid',
//       startY: 90,
//       drawRow: function (row, data) {
//         // Colspan
//         doc.setFontStyle('bold');
//         doc.setFontSize(10);
//         if (row.index === 0) {
//           doc.setTextColor(0, 0, 0);
//           doc.autoTableText("Mind Fin Ser Private Limited \n", data.settings.margin.left + data.table.width / 2, 50, {
//             halign: 'center',
//             valign: 'middle'
//           });

//           doc.setTextColor(0, 0, 0);
//           doc.autoTableText("No. 10, 1st Floor, Krishna Block, 1st Main Road, Seshadripuram, Bangalore- 560020 \n",data.settings.margin.left + data.table.width /2, 70, {
//             halign: 'center',
//             valign: 'middle'
//           });

//           doc.setTextColor(0, 0, 0);
//           doc.autoTableText("Jan 2020 PaySlip \n", data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
//             halign: 'center',
//             valign: 'middle'
//           });
//           data.cursor.y += 20;
//         }
//         if (row.index === 10) {
//           doc.setTextColor(0, 0, 0);
//           doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'S');
//           doc.autoTableText(value.branch, data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
//             halign: 'center',
//             valign: 'middle'
//           });
//           data.cursor.y += 100;
//         }
// if(row.index=== 4){
//   doc.setTextColor(0, 0, 0);
//   doc.autoTableText("Allowance \n", data.settings.margin.left + data.table.width / 4, row.y + row.height / 2, {
//     halign: 'center',
//     valign: 'middle'
//   });
//   doc.setTextColor(0, 0, 0);
//   doc.autoTableText("Deduction \n", data.settings.margin.right + data.table.width / 4, row.y + row.height / 2, {
//     halign: 'center',
//     valign: 'middle'
//   });
// }
//         if (row.index === 10) {
//           doc.setTextColor(0, 0, 0);
//           doc.autoTableText("This is computer generated payslip,no signature is required \n", data.settings.margin.left + data.table.width / 2, 500, {
//             halign: 'center',
//             valign: 'middle'
//           });
//           data.cursor.y += 20;
//         }


//         //adding page
//         if (row.index % 5 === 0) {
//           var posY = row.y + row.height * 6 + data.settings.margin.bottom;
//           if (posY > doc.internal.pageSize.height) {
//             data.addPage();
//           }
//         }
//       },
//       // drawCell: function (cell, data) {
//       //   // Rowspan\
        
//       //   if (data.column.dataKey === 3) {
//       //     if (data.row.index % 5 === 0) {
//       //       doc.rect(cell.x, cell.y, data.table.width, cell.height * 5, 'S');
//       //       doc.autoTableText(data.row.index / 5 + 1 + '', cell.x + cell.width / 2, cell.y + cell.height * 5 / 2, {
//       //         halign: 'center',
//       //         valign: 'middle'
//       //       });
//       //     }
//       //     return false;
//       //   }
//       // },
//       styles: {
//         // cellPadding: 3,
//         // fontSize: 8,
//         // valign: 'middle',
//         // overflow: 'linebreak',
//         // tableWidth: 'auto',
//         // lineWidth: 0,

//       },
//       headerStyles: {
//         //columnWidth: 'wrap',
//         cellPadding: 2,
//         lineWidth: 0,
//         valign: 'top',
//         fontStyle: 'bold',
//         halign: 'center',    //'center' or 'right'
//         fillColor: [255, 255, 255],
//         //textColor: [78, 53, 73], //Black     
//         textColor: [255, 255, 255], //White     
//         fontSize: 8,
//         // visible: 'hidden'
//       },
//       bodyStyles: {
//         minCellHeight: 5,
//         fontStyle: 'bold',
//         margin: {
//             top: 10,
//             bottom: 40,
//             left: 1,
//             right: 1,
            
//             //width: 120
//             minCellWidth: 'auto',
//             align: 'center',
//         }
//       }
  
//     });
//     doc.save(value.name + ' Payslip.pdf');
//   };

//   getData(rowCount, value) {
//     rowCount = rowCount || 4;
//     var data = [];
//     for (var j = 0; j <= rowCount; j++) {
//       switch (j) {
//         case 1:
//           data.push({ 1: "Name", 2: value.name, 3: "Genrated Date", 4:value.updateddate  });
//           break;
//         case 2:
//           data.push({ 1: "Designation", 2: value.designation, 3: "UIN No", 4:value.empno });
//           break;
//         case 3:
//           data.push({ 1: "Transcation Type", 2: value.name, 3: "Transcation Number", 4:value.updateddate });
//           break;
//         case 4:
//           data.push({ 1: "Allowance",3:"Deduction", })
//           break;
//         case 5:
//           data.push({ 1: "Basic", 2: value.basicPay, 3: "Provident Fund", 4:value.basicPay});
//           break;
//         case 6:
//           data.push({ 1: "HRA", 2: value.basicPay, 3: "Profession Tax", 4: value.basicPay});
//           break;
//         case 7:
//           data.push({ 1: "Conveyance", 2:value.basicPay,3: "Profession Tax", 4: value.basicPay});
//           break;
//         case 8:
//           data.push({ 1: " ", 2: "Incentive Allowance", 3: value.basicPay, 4: "" });
//           break;
//           case 9:
//             data.push({ 1: " ", 2: "Netpay", 3: value.basicPay, 4: "" });
//           break;
//           // case 10:
//           //   data.push({ 1: " ", 2: value.basicPay, 3: "", 4: " " });
//           // break;
//       }
//     }
//     return data;
//   }


//   // Returns a new array each time to avoid pointer issues
//   getColumns = function () {
//     return [
//       { title: " ", dataKey: "1" },
//       { title: " ", dataKey: "2" },
//       { title: " ", dataKey: "3" },
//       { title: " ", dataKey: "4" }
//       // { title: " ", dataKey: "5" }

//     ];
//   }
//   // getBase64Image(img) {
//   //   var canvas = document.createElement("canvas");
//   //   console.log("image");
//   //   canvas.width = img.width;
//   //   canvas.height = img.height;
//   //   var ctx = canvas.getContext("2d");
//   //   ctx.drawImage(img, 0, 0);
//   //   var dataURL = canvas.toDataURL('image/jpeg', 1.0);
//   //   return dataURL;
//   // }
 

// exportAs(type: SupportedExtensions, opt?: string) {
//   this.config.type = type;
//   if (opt) {
//     this.config.options.jsPDF.orientation = opt;
//   }
//   this.exportAsService.save(this.config, 'myFile').subscribe(() => {
//     // save started
//   });
//   // this.exportAsService.get(this.config).subscribe(content => {
//   //   const link = document.createElement('a');
//   //   const fileName = 'export.pdf';

//   //   link.href = content;
//   //   link.download = fileName;
//   //   link.click();
//   //   console.log(content);
//   // });
// }

// pdfCallbackFn (pdf: any) {
//   // example to add page number as footer to every page of pdf
//   const noOfPages = pdf.internal.getNumberOfPages();
//   for (let i = 1; i <= noOfPages; i++) {
//     pdf.setPage(i);
//     pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
//   }
// }
  
  
}
