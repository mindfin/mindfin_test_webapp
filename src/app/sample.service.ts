import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as saveAs from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class SampleService {

  constructor() { }

//   public exportAsExcelFile(json: any[], excelFileName: string): void {
//   //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
//   //   const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
//   //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
//   //   this.saveAsExcelFile(excelBuffer, excelFileName);
//   // }
//     // const data = json;
//   // private saveAsExcelFile(buffer: any, fileName: string): void {
//     const blob = new Blob(json, {
//       type: 'text/csv'
//     });
//   //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
//   //   console.log("ds");
//   // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
//   // console.log(blob);
//   // FileSaver.saveAs(blob, "hello world.txt");
//   var url= window.URL.createObjectURL(blob);
//   window.open(url);
// // }
//   }

 JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel,fileName) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
  
  var CSV = '';    
  //Set Report title in first row or line
  
  // CSV += ReportTitle + '\r\n\n';

  //This condition will generate the Label/Header
  if (ShowLabel) {
      var row = "";
      
      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
          
          //Now convert each value to string and comma-seprated
          row += index + ',';
      }

      row = row.slice(0, -1);
      
      //append Label row with line break
      CSV += row + '\r\n';
  }
  
  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
      var row = "";
      
      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
      }

      row.slice(0, row.length - 1);
      
      //add a line break after each row
      CSV += row + '\r\n';
  }

  if (CSV == '') {        
      alert("Invalid data");
      return;
  }   
  
  //Generate a file name
//   var fileName = "MyReport_";
  //this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g,"_");   
  
  //Initialize file format you want csv or xls
  var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
  
  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension    
  
  //this trick will generate a temp <a /> tag
  var link = document.createElement("a");    
  link.href = uri;
  
  //set the visibility hidden so it will not effect on your web-layout
  // link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  
  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

}