import { Injectable, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { componentFactoryName } from '@angular/compiler';
import * as XLSX from 'xlsx';

// import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import { Booking } from '../../models/booking.model';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { TabHeadingDirective } from 'ngx-bootstrap/tabs';
 

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  commonurl = 'http://test.mindfin.co.in';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  constructor(private http: HttpClient, private router: Router, private idle: Idle, private keepalive: Keepalive) {
    // sets an idle timeout of 5 seconds, for testing purposes.

    idle.setIdle(86400);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(32400);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      localStorage.clear();
      window.location.reload();
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(32400);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  private posts = [];
  private postsUpdated = new Subject<{ posts: any[]; postCount: number }>();




  logininsert(obj) {
    const uri = this.commonurl+'/callapi/logininsert';
    return this.http.post(uri, obj)
      .subscribe(res => {
      });
  }
  getMacAddress() {
    const uri = this.commonurl+'/callapi/getMacAddress';
    return this.http.get(uri) 
  }
  getAllMacAddress() {
    const uri = this.commonurl+'/callapi/getAllMacAddress';
    return this.http.get(uri) 
  }
  //login select

  login(loginvalue) {
    // console.log(loginvalue);
    const uri = this.commonurl+'/callapi/adminlogin/';
    this.http.post(uri, loginvalue).subscribe(res => {
      console.log(res);
      // console.log(res[0].user);
      if (res == null || res == undefined || res == 0) {
        alert('Invalid Username Or Password');
        window.location.reload();
      }
      else if (res[0].user == 'SUPERADMIN') {
        console.log('superadmin')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('branch', res[0]['branch']);

        localStorage.setItem('role', 'SUPERADMIN');
        this.router.navigate(['/dashboard']);

      }
      else if (res[0].user == 'ADMIN') {
        console.log('admin')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('branch', res[0]['branch']);
        localStorage.setItem('role', 'ADMIN');
        this.router.navigate(['/notification/profilesettings']);
      }
      else if (res[0].user == 'EXECUTIVE' && res[0].designation == 'Admin') {
        console.log('EXECUTIVE')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('desc', res[0]['designation']);
        localStorage.setItem('branch', res[0]['branch']);
        localStorage.setItem('role', 'EXECUTIVE');
        this.router.navigate(['/notification/profilesettings']);
      }
      else if (res[0].user == 'EXECUTIVE' && res[0].designation != 'Admin') {
        console.log('exec')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('branch', res[0]['branch']);
        localStorage.setItem('role', 'EXECUTIVE');
        localStorage.setItem('desc', res[0]['designation']);
        this.router.navigate(['/dashboard/executive']);
      }
      else if (res[0].user == 'BACKEND') {
        console.log('back')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('branch', res[0]['branch']);
        localStorage.setItem('role', 'BACKEND');
        this.router.navigate(['/dashboard/backend']);
      }
      else if (res[0].user == 'DATAENTRY') {
        console.log('data')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('branch', res[0]['branch']);
        localStorage.setItem('role', 'DATA ENTRY');
        this.router.navigate(['/dashboard/dataentry']);
      }
      else if (res[0].user == 'TELECALLER') {
        console.log('tel')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('branch', res[0]['branch']);
        localStorage.setItem('role', 'TELECALLER');
        this.router.navigate(['/dashboard/telecaller']);
      }
      else if (res[0].user == 'GUEST') {
        console.log('GUEST')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('role', 'GUEST');
        this.router.navigate(['/guest/home']);
      }
      else if (res[0].user == 'LOGIN') {
        console.log('login')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('branch', res[0]['branch']);
        localStorage.setItem('desc', res[0]['designation']);
        localStorage.setItem('role', 'LOGIN');
        this.router.navigate(['/dashboard/login']);
      }
      else if (res[0].user == 'ACCOUNTANT') {
        console.log('account')
        localStorage.setItem('id', res[0]['idemployee']);
        localStorage.setItem('empname', res[0]['name']);
        localStorage.setItem('branch', res[0]['branch']);
        localStorage.setItem('role', 'ACCOUNTANT');
        this.router.navigate(['/notification/profilesettings']);
      }
      else if (res[0].user == 'SUB VENDOR') {
        console.log('account')
        // localStorage.setItem('id',res[0]['idemployee']);
        // localStorage.setItem('role','ACCOUNTANT');
        // this.router.navigate(['/account/subvendor']);
      }
      else if (res[0].user == 'SUB CHANNEL') {
        console.log('account')
        // localStorage.setItem('id',res[0]['idemployee']);
        // localStorage.setItem('role','ACCOUNTANT');
        // this.router.navigate(['/account/subvendor']);
      }
      else {
        // console.log('tele')
        console.log('custo')
        localStorage.setItem('id', res[0]['idcustomer']);
        localStorage.setItem('custname', res[0]['name']);
        localStorage.setItem('role', 'CUSTOMER');
        this.router.navigate(['/member/customerprofile']);
       
      }
    });
  }
 



  getadminlist() {

    const uri = this.commonurl+'/callapi/getadminlist/';
    return this.http.get(uri);
  }


  //pie chart in gettotalbooking

  totalmember() {
    const uri = this.commonurl+'/callapi/gettotalbooking';
    return this.http.get(uri);
  }

  //total project

  employeecount() {
    const uri = this.commonurl+'/callapi/employeecount';
    return this.http.get(uri);
  }


  membercount() {
    const uri = this.commonurl+'/callapi/membercount';
    return this.http.get(uri);
  }
  piechart() {
    const uri = this.commonurl+'/callapi/piechart';
    return this.http.get(uri);
  }

  pendingcount() {
    const uri = this.commonurl+'/callapi/pendingcount';
    return this.http.get(uri);
  }

  rejectcount() {
    const uri = this.commonurl+'/callapi/rejectcount';
    return this.http.get(uri);
  }



  customeradd(fd) {
    console.log(fd);
    const uri = this.commonurl+'/callapi/customeradd';
    return this.http.post(uri, fd)

  }



  loaninsert(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/loaninsert';
    this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  getloanlist() {
    const uri = this.commonurl+'/callapi/getloanlist/';
    return this.http.get(uri);
  }


  getexecutivelist() {

    const uri = this.commonurl+'/callapi/getexecutivelist/';
    return this.http.get(uri);
  }
 

  bankinsert(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/bankinsert';
    this.http.post(uri, obj).subscribe(res => {
    })
  }

  getbanklist() {

    const uri = this.commonurl+'/callapi/getbanklist/';
    return this.http.get(uri);
  }

  getnames(obj) {
    console.log(obj)
    const uri = this.commonurl+'/callapi/getnames/';
    return this.http.post(uri, obj);
  }
  // checkcurrentpwd(obj){
  //   console.log(obj);
  //   const uri=this.commonurl+'/member/checkcurrentpwd';
  // return  this.http.post(uri,obj);

  // }


  approvecustomer(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/approvecustomer';
    this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  approve(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/approve';
    this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  pdapprove(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/pdapprove';
    this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  loginapprove(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/loginapprove';
    this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  getCustomerlist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/approvedlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getCustomerlistDetails() {
    return this.postsUpdated.asObservable();
  }

  // rejectcustomer(obj){
  // console.log(obj);
  // const uri = this.commonurl+'/callapi/rejectcustomer';
  // this.http.post(uri,obj).subscribe(res=>{
  // //console.log('');
  // })
  // }
  rejectcustomer(obj, obj1) {
    console.log(obj);
    const queryParams = `/${obj}/${obj1}`;
    const uri = this.commonurl+'/callapi/rejectcustomer' + queryParams;
    this.http.get(uri).subscribe(res => {

    })
  }
  rejectbank(obj, obj1) {
    console.log(obj);
    const queryParams = `/${obj}/${obj1}`;
    const uri = this.commonurl+'/callapi/rejectbank' + queryParams;
    this.http.get(uri).subscribe(res => {

    })
  }
  employeeadd(fd) {
    console.log(fd);
    const uri = this.commonurl+'/callapi/addemployee';
    return this.http.post(uri, fd)

  }

  userinsert(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/userinsert';
    this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  getuserlist() {
    const uri = this.commonurl+'/callapi/getuserlist/';
    return this.http.get(uri);
  }

  employeetypeinsert(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/employeetypeinsert';
    this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  getemployeetypelist() {
    const uri = this.commonurl+'/callapi/getemployeetypelist/';
    return this.http.get(uri);
  }



  getemployeelist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getemployeelist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getemployeeDetails() {
    return this.postsUpdated.asObservable();
  }

  editmember(id) {
    console.log(id);
    this.router.navigate(['/member/editemployee/' + id]);
  }

  editemp(id) {

    const uri = this.commonurl+'/callapi/editemp/' + id;
    return this.http.get(uri);
  }


  editemployee(fd) {
    console.log(fd);
    const uri = this.commonurl+'/callapi/editemployee/';
    this.http.post(uri, fd).subscribe(res => {
      console.log(res);
    });
  }


  memlogin(loginvalue) {
    console.log(loginvalue);
    const uri = this.commonurl+'/callapi/memberlogin/';
    // return this.http.post(uri,obj);
    this.http.post(uri, loginvalue).subscribe(res => {
      console.log(res);
      if (res['status'] == false) {
        alert('Invalid Email Or Password');
        window.location.reload();
      }
      else {
        localStorage.setItem('id', res[0]['idcustomer']);
        localStorage.setItem('role', 'CUSTOMER');
        this.router.navigate(['/member/customerprofile']);
      }
    });
  }

  homememberlist(memberid) {
    console.log(memberid);
    const uri = this.commonurl+'/callapi/homememberlist/' + memberid;
    return this.http.get(uri);
  }

  memberviewdetails(memberid) {
    console.log(memberid);
    const uri = this.commonurl+'/callapi/memberviewdetails/' + memberid;
    return this.http.get(uri);
  }

  getexecutiveelist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getexecutiveelist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  viewcustomerid(postsPerPage: number, currentPage: number, idvalue: String) {
   
    const queryParams = `/${postsPerPage}/${currentPage}/${idvalue}`;
    console.log(queryParams);
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/viewcustomerid' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }




  viewcustomeridDetails() {
    return this.postsUpdated.asObservable();
  }




  getexecutiveDetails() {
    return this.postsUpdated.asObservable();
  }

  editcustomer(id) {
    console.log(id);
    this.router.navigate(['/members/editcustomer/' + id]);
  }
  viewbank(id) {
    // this.router.navigate(['/members/viewbank/' +id]);
    this.router.navigate(['/members/bankapply/' + id]);

  }
  viewbank1(id) {
    this.router.navigate(['/members/viewbank/' + id]);
    // this.router.navigate(['/members/bankapply/' +id]);

  }
  viewbankk(id) {
    console.log('bye');
    this.router.navigate(['/members/bankdisburse/' + id]);
    // this.router.navigate(['/members/bankapply/' +id]);

  }
  // viewcustomerid(id){
  // console.log(id);
  // const uri=this.commonurl+'/callapi/viewcustomerid/' + id;
  //  return this.http.get(uri);
  // }



  viewcustomer(id) {
    console.log(id);
    this.router.navigate(['/members/viewcustomer/' + id]);
  }



  editcust(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/editcust/' + id;
    return this.http.get(uri);
  }

  getextradetails(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/getextradetails/' + id;
    return this.http.get(uri);
  }
  customerupdate(fd) {
    console.log(fd);
    const uri = this.commonurl+'/callapi/customerupdate/';
    return this.http.post(uri, fd);

  }

  getaging(date) {
    console.log(date)
    const uri = this.commonurl+'/callapi/getaging/ ' + date;
    return this.http.get(uri);
  }

  deleteemp(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/deleteemp/ ';
    return this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }
  addbank(id) {
    console.log(id);
    this.router.navigate(['/members/custstatus/' + id]);

  }

  // checktrack(id)
  // {
  // console.log(id);
  // const uri=this.commonurl+'/callapi/checktrack' + id;
  // return  this.http.get(uri);
  // //  .subscribe(res=>{
  // //   console.log(res);
  // //   })
  // // this.router.navigate(['/members/track/' +id]);
  // }



  checktrack(id) {
    console.log(id);
    // const uri=this.commonurl+'/callapi/checktrack/' + id;
    //   this.http.get(uri)
    //     .subscribe(res=>{
    //    console.log(res);
    this.router.navigate(['/member/track/' + id]);

    //  })
    //  this.router.navigate(['/members/track/' +id]);
  }

  applybank(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/applybank/';
    this.http.post(uri, obj).subscribe(res => {
      console.log(res);
    })
  }


  trackcheck(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/checktrack/' + id;
    return this.http.get(uri, id)
    //  .subscribe(res=>{
    //   console.log(res);
    //   })

  }


  hotCustomers(postsPerPage: number, currentPage: number) {
    console.log('service');
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/hotCustomers' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  hotCustomersDetails() {
    return this.postsUpdated.asObservable();
  }

  businesslistinsert(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/businesslistinsert';
    this.http.post(uri, obj).subscribe(res => {
    })
  }


  onChange(obj) {
    const uri = this.commonurl+'/callapi/onChange';
    return this.http.post(uri, obj);
  }

  // addtopup(obj){
  //   console.log(obj);
  //   const uri=this.commonurl+'/callapi/addtopup';
  //  return this.http.post(uri,obj);
  // }

  getbusinesslist() {
    const uri = this.commonurl+'/callapi/getbusinesslist/';
    return this.http.get(uri);
  }
  getApprovedBankList(id) {
    const uri = this.commonurl+'/callapi/getApprovedBankList/' + id;
    return this.http.get(uri);
  }

  getApprovedBankListt(id) {
    const uri = this.commonurl+'/callapi/getApprovedBankListt/' + id;
    return this.http.get(uri, id);
  }
  getRejectBankListt(id) {
    const uri = this.commonurl+'/callapi/getRejectBankListt/' + id;
    return this.http.get(uri, id);
  }
  getviewbanklist(id) {
    const uri = this.commonurl+'/callapi/getviewbanklist/' + id;
    return this.http.get(uri);
  }

  getviewbanklistt(id) {
    const uri = this.commonurl+'/callapi/getviewbanklistt/' + id;
    return this.http.get(uri);
  }

  getViewPrevBankList(id) {
    const uri = this.commonurl+'/callapi/getViewPrevBankList/' + id;
    return this.http.get(uri);
  }

  addenquiry(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/addenquiry';
    return this.http.post(uri, obj)
  }
  getEnquirylist(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getenquirylist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getEnquirylistDetails() {
    return this.postsUpdated.asObservable();
  }


  enquirycount(id) {
    const uri = this.commonurl+'/callapi/enquirycount/' + id;
    return this.http.get(uri);
  }




  getPdlist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getPdlist' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPdlistDetails() {
    return this.postsUpdated.asObservable();
  }


  getApprovallist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getApprovallist' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getApprovallistDetails() {
    return this.postsUpdated.asObservable();
  }


  getDisburstlist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getDisburstlist' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getDisburstlistDetails() {
    return this.postsUpdated.asObservable();
  }

  dataentrycount() {
    const uri = this.commonurl+'/callapi/dataentrycount/';
    return this.http.get(uri);
  }


  pdcount() {
    const uri = this.commonurl+'/callapi/pdcount/';
    return this.http.get(uri);
  }

  approvecount() {
    const uri = this.commonurl+'/callapi/approvcount/';
    return this.http.get(uri);
  }

  disbursecount() {
    const uri = this.commonurl+'/callapi/disbursecount/';
    return this.http.get(uri);
  }

  enqcount() {
    const uri = this.commonurl+'/callapi/enqcount/';
    return this.http.get(uri);
  }
  bankapply(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/bankapply';
    this.http.post(uri, obj).subscribe(res => {
    })
  }

  singleCustomer(id) {
    const uri = this.commonurl+'/callapi/singleCustomer/' + id;
    return this.http.get(uri, id);
  }

  gettopuplist(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/gettopuplist/' + id;
    return this.http.get(uri, id);
  }

  topupcustomer(id) {
    console.log(id);
    this.router.navigate(['/members/topuplist/' + id]);
  }
  topupnotifycustomer(id) {
    console.log(id);
    this.router.navigate(['/members/topupnotifylist/' + id]);
  }
  getPeriod() {
    const uri = this.commonurl+'/callapi/getPeriod';
    return this.http.get(uri);
    // .subscribe(res=>{
    // })
  }
  checkcurrent(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/checkcurrent/' + id;
    return this.http.get(uri, id);
  }

  addPeriod(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/addPeriod';
    return this.http.post(uri, obj)
  }

  getperiodlist() {

    const uri = this.commonurl+'/callapi/getperiodlist/';
    return this.http.get(uri);
  }

  addtopup(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/addtopup';
    return this.http.post(uri, obj);
  }
  getrejectlist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/rejectlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getrejectDetails() {
    return this.postsUpdated.asObservable();
  }


  settings(values) {
    console.log(values);
    const uri = this.commonurl+'/callapi/settings';

    this.http.post(uri, values).subscribe(res => {
      console.log(res);

    });
  }
  settingslist() {
    const uri = this.commonurl+'/callapi/settinglist';
    return this.http.get(uri);
  }



  programinsert(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/programinsert';
    this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  getprogramlist() {

    const uri = this.commonurl+'/callapi/getprogramlist/';
    return this.http.get(uri);
  }

  // gettopupnotifylist(postsPerPage: number, currentPage: number){
  //   const queryParams = `/${postsPerPage}/${currentPage}`;
  // this.http
  // .get<{ message: string; posts: any; maxPosts: number }>(
  //   this.commonurl+'/callapi/gettopupnotifylist' + queryParams
  // )
  // .pipe(
  //   map(postData => {
  //     return {
  //       posts: postData.posts,
  //       maxPosts: postData.maxPosts
  //     };
  //   })
  // )
  // .subscribe(transformedPostData => {
  //   this.posts = transformedPostData.posts;
  //   this.postsUpdated.next({
  //     posts: [...this.posts],
  //     postCount: transformedPostData.maxPosts
  //   });
  // });
  // }

  // gettopupnotifylistDetails(){
  // return this.postsUpdated.asObservable();
  // }
  gettopupnotifylist(obj) {
    // console.log(id);
    const uri = this.commonurl+'/callapi/gettopupnotifylist/' + obj;
    return this.http.get(uri);
  }

  getexecutivetopuplist(id) {
    const uri = this.commonurl+'/callapi/getexecutivetopuplist/' + id;
    return this.http.get(uri, id)
  }

  topUpSucess(obj) {
    const uri = this.commonurl+'/callapi/topUpSucess';
    return this.http.post(uri, obj);
  }
  // getsuccesstopuplist(){
  //   const uri = this.commonurl+'/callapi/getsuccesstopuplist/' ;
  //   return this.http.get(uri)
  // }
  getSubVendor() {
    const uri = this.commonurl+'/callapi/getSubVendor';
    return this.http.get(uri)
  }
  CustomerList(id) {
    this.router.navigate(['/account/customerlist/' + id]);

    // const uri=this.commonurl+'/callapi/customerList';
    // return this.http.post(uri,obj);
  }
  getSubvendorCustomerList(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/customerList/' + id;
    return this.http.get(uri);
  }

  savePayout(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/savePayout';
    return this.http.post(uri, obj);
  }
  addPayOut(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/addPayOut';
    return this.http.post(uri, obj);
  }
  getDisburseCustomerList() {
    const uri = this.commonurl+'/callapi/getDisburseCustomerList';
    return this.http.get(uri);
  }
  checknumber(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/checknumber';
    return this.http.post(uri, obj);
  }
  getvendornames() {
    const uri = this.commonurl+'/callapi/getvendornames';
    return this.http.get(uri);
  }
  gettranscationdata(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/gettranscationdata/' + id;
    return this.http.get(uri);
  }

  getApproveBankList(id) {
    const uri = this.commonurl+'/callapi/getApproveBankList/' + id;
    return this.http.get(uri);
  }

  applyLoan(id) {
    // console.log(obj);
    // const uri=this.commonurl+'/callapi/applyLoan';
    // return this.http.post(uri,obj);
    this.router.navigate(['/account/reloan/' + id]);
  }
  reloanapply(fd) {
    console.log(fd);
    const uri = this.commonurl+'/callapi/reloanapply';
    return this.http.post(uri, fd);

  }
  bulkSms(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/bulkSms';
    return this.http.post(uri, obj);
  }

  getDetails(obj) {
    const uri = this.commonurl+'/callapi/getDetails';
    return this.http.post(uri, obj);
  }

  getPreviousBankDetails(obj) {
    const uri = this.commonurl+'/callapi/getPreviousBankDetails';
    return this.http.post(uri, obj);
  }
  getApprovedBankDetails(obj) {
    const uri = this.commonurl+'/callapi/getApprovedBankDetails';
    return this.http.post(uri, obj);
  }
  accountdetails(obj) {
    const uri = this.commonurl+'/callapi/accountdetails';
    return this.http.post(uri, obj);
  }



  getsuccesstopuplist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getsuccesstopuplist' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getsuccesstopuplistDetails() {
    return this.postsUpdated.asObservable();
  }
  checkaadharnumber(obj) {
    // console.log(obj);
    const uri = this.commonurl+'/callapi/checkaadharnumber';
    return this.http.post(uri, obj);
  }
  checkpannumber(obj) {
    // console.log(obj);
    const uri = this.commonurl+'/callapi/checkpannumber';
    return this.http.post(uri, obj);
  }
  checkdlnumber(obj) {
    // console.log(obj);
    const uri = this.commonurl+'/callapi/checkdlnumber';
    return this.http.post(uri, obj);
  }
  checkvoternumber(obj) {
    // console.log(obj);
    const uri = this.commonurl+'/callapi/checkvoternumber';
    return this.http.post(uri, obj);
  }
  getemployeename(id) {
    console.log(id);
    const url = this.commonurl+'/callapi/getemployeename/' + id;
    return this.http.get(url);
  }

  // getemployeetypelist(){
  //   const url=this.commonurl+'/callapi/getemployeetypelist';
  //   return this.http.get(url);
  // }
  getCompanyname() {
    var empid = localStorage.getItem('id');
    const uri = this.commonurl+'/callapi/getCompanyname/' + empid;
    return this.http.get(uri);

  }
  getbankname() {
    const uri = this.commonurl+'/callapi/getbankname';
    return this.http.get(uri);

  }
  // addroutine(obj, empid) {
  //   console.log(obj);
  //   const uri = this.commonurl+'/callapi/addroutine/' + empid;
  //   return this.http.post(uri, obj);
  // }

  editData(id) {
    console.log(id);
    this.router.navigate(['/executives/editenquiry/' + id]);
  }
  editdataa(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/editdataa/' + id;
    return this.http.get(uri);
  }

  updateenquiry(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/updateenquiry';
    this.http.post(uri, obj).subscribe(res => {
    })
  }
  enquirycount1() {
    const uri = this.commonurl+'/callapi/enquirycount1';
    return this.http.get(uri);
  }
  // viewroutine(obj) {
  //   console.log(obj);
  //   const uri = this.commonurl+'/callapi/viewroutine/' + obj;
  //   return this.http.get(uri);
  // }

  getEnquirylistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquirylistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getEnquirylistexeDetails() {
    return this.postsUpdated.asObservable();
  }
  enquirycount2(obj) {
    const uri = this.commonurl+'/callapi/enquirycount2/' + obj;
    return this.http.get(uri);
  }

  viewroutine(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/viewroutine' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  viewroutineDetails() {
    return this.postsUpdated.asObservable();
  }
  editData1(id) {
    console.log(id);
    this.router.navigate(['/executives/editroutine/' + id]);
  }
  editdata1(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/editdata1/' + id;
    return this.http.get(uri);
  }
  editroutine(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/editroutine';
    return this.http.post(uri, obj);
  }
  dataentrypiechart() {
    const uri = this.commonurl+'/callapi/dataentrypiechart';
    return this.http.get(uri);
  }
  getbankrejectlist(postsPerPage: number, currentPage: number, id: number) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getbankrejectlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getbankrejectDetails() {
    return this.postsUpdated.asObservable();
  }
  approvalmember(obj, obj1) {
    console.log(obj);
    const queryParams = `/${obj}/${obj1}`;
    const uri = this.commonurl+'/callapi/approvalmember' + queryParams;
    this.http.get(uri).subscribe(res => {

    })
  }
  casecount(obj) {
    const uri = this.commonurl+'/callapi/casecount/' + obj;
    return this.http.get(uri);
  }
  topupcount(obj) {
    const uri = this.commonurl+'/callapi/topupcount/' + obj;
    return this.http.get(uri);
  }
  custdocument(fd) {
    console.log(fd);
    const uri = this.commonurl+'/callapi/custdocument';
    return this.http.post(uri, fd)
  }
  getdocument(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getdocument' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getdocumentDetails() {
    return this.postsUpdated.asObservable();
  }
  getdocument3(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getdocument3' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getdocument3Details() {
    return this.postsUpdated.asObservable();
  }
  backendaddbank(id) {
    console.log(id);
    this.router.navigate(['/backend/applybank/' + id]);

  }
  backendviewbank(id) {
    console.log(id);
    this.router.navigate(['/backend/status/' + id]);

  }
  backendedit(id) {
    console.log(id);
    this.router.navigate(['/backend/edit/' + id]);
  }
  backendeditemp(id) {

    const uri = this.commonurl+'/callapi/backendedit/' + id;
    return this.http.get(uri);
  }
  editcustdoc(fd) {
    console.log(fd);
    const uri = this.commonurl+'/callapi/editcustdoc';
    return this.http.post(uri, fd)
  }

  backendbankinsert(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/backendbankinsert';
    this.http.post(uri, obj).subscribe(res => {
      console.log(res);
    })
  }
  getdocument1(postsPerPage: number, currentPage: number, obj) {
    const queryParams = `/${postsPerPage}/${currentPage}/${obj}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getdocument1' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getdocument1Details() {
    return this.postsUpdated.asObservable();
  }
  getbackendviewbanklist(id) {
    const uri = this.commonurl+'/callapi/getbackendviewbanklist/' + id;
    return this.http.get(uri);
  }
  editstatus(obj) {
    console.log(obj);
    // const queryParams = `/${obj}/${obj1}`;
    const uri = this.commonurl+'/callapi/editstatus';
    return this.http.post(uri, obj);
  }
  addroutine(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/addroutine';
    this.http.post(uri, obj).subscribe(res => {
      console.log(res);
    }) 
  }
  loginviewbank(id) {
    console.log(id);
    this.router.navigate(['/loginoperation/loginstatus/' + id]);

  }
  getloginexecutivelist() {

    const uri = this.commonurl+'/callapi/getloginexecutivelist/';
    return this.http.get(uri);
  }
  sentlogexe(obj, obj1, obj2) {
    console.log(obj);
    const queryParams = `/${obj1}/${obj2}`;
    const uri = this.commonurl+'/callapi/sentlogexe' + queryParams;
    return this.http.post(uri, obj);
  }
  sentlogexeedit(id) {
    console.log(id);
    this.router.navigate(['/loginoperation/sentexelogedit/' + id]);
  }
  sentexelogedit1(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/sentexelogedit1/' + id;
    return this.http.get(uri);
  }

  getloginlist(postsPerPage: number, currentPage: number, obj) {
    const queryParams = `/${postsPerPage}/${currentPage}/${obj}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getloginlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getloginlistDetails() {
    return this.postsUpdated.asObservable();
  }
  addloginroutine(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/addloginroutine';
    this.http.post(uri, obj).subscribe(res => {
      console.log(res);
    })
  }
  logineditData(id) {
    console.log(id);
    this.router.navigate(['/loginoperation/logineditroutine/' + id]);
  }
  editloginroutine(obj, empid) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/editloginroutine/' + empid;
    return this.http.post(uri, obj);
  }
  viewtele(id) {
    console.log(id);
    this.router.navigate(['/executives/exeteledatalist1/' + id]);
  }
  checkcustomer(obj) {
    // console.log(obj);
    const uri = this.commonurl+'/callapi/checkcustomer';
    return this.http.post(uri, obj).subscribe(res => {
      console.log(res);
      // console.log(res[0].user);
      if (res == null || res == undefined || res == 0) {
        alert('CUSTOMER NOT EXIST!!!');
        this.router.navigate(['/members/add']);
      }
      else {
        const id = res[0].idcustomer;
        alert('CUSTOMER EXISTS!!!!');
        this.router.navigate(['/account/reloan/' + id]);
      }
    })
  }
  logincount(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/logincount/' + obj;
    return this.http.get(uri);
  }
  completlist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/completlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  completlistDetails() {
    return this.postsUpdated.asObservable();
  }
  banklist(id) {
    console.log(id);
    this.router.navigate(['/members/bankreject/' + id]);
  }
  getDataEnquirylist(postsPerPage: number, currentPage: number, sdate, edate) {
    console.log(sdate)
    console.log(edate)
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getDataEnquirylist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getDataEnquirylistDetails() {
    return this.postsUpdated.asObservable();
  }
  getBackendlist(postsPerPage: number, currentPage: number, sdate, edate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getBackendlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getBackendlistDetails() {
    return this.postsUpdated.asObservable();
  }
  getLoginreportlist(postsPerPage: number, currentPage: number, sdate, edate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getLoginreportlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getLoginreportlistDetails() {
    return this.postsUpdated.asObservable();
  }
  getLoginroutinelist(postsPerPage: number, currentPage: number, sdate, edate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getLoginroutinelist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getLoginroutinelistDetails() {
    return this.postsUpdated.asObservable();
  }
  getExecutiveroutinelist(postsPerPage: number, currentPage: number, sdate, edate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getExecutiveroutinelist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getExecutiveroutinelistDetails() {
    return this.postsUpdated.asObservable();
  }
  getDataentryReportlist(postsPerPage: number, currentPage: number, sdate, edate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getDataentryReportlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getDataentryReportlistDetails() {
    return this.postsUpdated.asObservable();
  }

  geEnquiryDatalist(postsPerPage: number, currentPage: number, sdate, exeid) {
    console.log(sdate)
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${exeid}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/geEnquiryDatalist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getEnquiryDatalistDetails() {
    return this.postsUpdated.asObservable();
  }

  casedoccount() {
    const uri = this.commonurl+'/callapi/casedoccount';
    return this.http.get(uri);
  }

  caselogin() {
    const uri = this.commonurl+'/callapi/caselogin';
    return this.http.get(uri);
  }

  casepd() {
    const uri = this.commonurl+'/callapi/casepd';
    return this.http.get(uri);
  }

  caseapproval() {
    const uri = this.commonurl+'/callapi/caseapproval';
    return this.http.get(uri);
  }

  casereject() {
    const uri = this.commonurl+'/callapi/casereject';
    return this.http.get(uri);
  }

  casedisburse() {
    const uri = this.commonurl+'/callapi/casedisburse';
    return this.http.get(uri);
  }

  casewip() {
    const uri = this.commonurl+'/callapi/casewip';
    return this.http.get(uri);
  }
  getdocument2(postsPerPage: number, currentPage: number, sdate, obj) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${obj}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getdocument2' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getdocument2Details() {
    return this.postsUpdated.asObservable();
  }
  getloginlist1(postsPerPage: number, currentPage: number, sdate, obj) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${obj}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getloginlist1' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getloginlist1Details() {
    return this.postsUpdated.asObservable();
  }
  checkcase(obj) {

    const uri = this.commonurl+'/callapi/checkcase';
    return this.http.post(uri, obj)

  }

  getdocument4(postsPerPage: number, currentPage: number, sdate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getdocument4' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getdocument4Details() {
    return this.postsUpdated.asObservable();
  }
  getdocument5(postsPerPage: number, currentPage: number, sdate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getdocument5' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getdocument5Details() {
    return this.postsUpdated.asObservable();
  }
  topuplist(obj) {
    console.log(obj);
    this.router.navigate(['/executives/topuplist/' + obj]);

  }
  editcocust(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/editcocust';
    return this.http.post(uri, obj);
  }
  getcocustomer(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/getcocustomer/' + id;
    return this.http.get(uri);

  }
  getadminexecutivelist() {

    const uri = this.commonurl+'/callapi/getadminexecutivelist/';
    return this.http.get(uri);
  }
  getteamhead() {

    const uri = this.commonurl+'/callapi/getteamhead/';
    return this.http.get(uri);
  }
  getEnquirylistexe1(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquirylistexe1' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquirylistexeDetails1() {
    return this.postsUpdated.asObservable();
  }
  teleeditData(id) {
    console.log(id);
    this.router.navigate(['/executives/admineditenquiry/' + id]);
  }
  teleeditDataa(id) {
    console.log(id);
    const uri = this.commonurl+'/callapi/teleeditData/' + id;
    return this.http.get(uri);
  }
  getDataEnquirylist1(postsPerPage: number, currentPage: number, sdate, edate, exeid) {
    console.log(sdate)
    console.log(edate)
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}/${exeid}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getDataEnquirylist1' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getDataEnquirylistDetails1() {
    return this.postsUpdated.asObservable();
  }
  assignexe(obj) {
    console.log(obj);
    // const queryParams = `/${obj}/${obj1}`;
    const uri = this.commonurl+'/callapi/assignexe';
    return this.http.post(uri, obj)
  }

  getContactformlist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getContactformlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getContactformlistDetails() {
    return this.postsUpdated.asObservable();
  }

  getcareerformlist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getcareerformlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getcareerformlistDetails() {
    return this.postsUpdated.asObservable();
  }
  getCallbackformlist(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getCallbackformlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getCallbackformlistDetails() {
    return this.postsUpdated.asObservable();
  }

  public uploadImage(file) {
    console.log(file)
    return this.http.post(this.commonurl+'/callapi/image-upload', file);
  }
  public suggbox(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/suggbox', value);
  }
  public leaveapp(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/leaveapp', value);
  }
  public conves(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/conves', value);
  }
  activeemp(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/activeemp/ ';
    return this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  getinactiveemployeelist(postsPerPage: number, currentPage: number) {
    const queryParams = '/${postsPerPage}/${currentPage}';
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getinactiveemployeelist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getinactiveemployeeDetails() {
    return this.postsUpdated.asObservable();
  }

  gettopleave(postsPerPage: number, currentPage: number, empid: number) {

    const queryParams = `/${postsPerPage}/${currentPage}/${empid}`;
    console.log(queryParams);
    const uri = this.commonurl+'/callapi/gettopleave' + queryParams;
    return this.http.get(uri);
  }
  gettopconven(postsPerPage: number, currentPage: number, empid: number) {

    const queryParams = `/${postsPerPage}/${currentPage}/${empid}`;
    console.log(queryParams);
    const uri = this.commonurl+'/callapi/gettopconven' + queryParams;
    return this.http.get(uri);
  }
  gettopsug(postsPerPage: number, currentPage: number, empid: number) {

    const queryParams = `/${postsPerPage}/${currentPage}/${empid}`;
    console.log(queryParams);
    const uri = this.commonurl+'/callapi/gettopsug' + queryParams;
    return this.http.get(uri);
  }
  getconven(postsPerPage: number, currentPage: number, empid: number) {
    const queryParams = `/${postsPerPage}/${currentPage}/${empid}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getconven' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getconvenDetails() {
    return this.postsUpdated.asObservable();
  }
  getleavapp(postsPerPage: number, currentPage: number, empid: number) {
    const queryParams = `/${postsPerPage}/${currentPage}/${empid}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getleavapp' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getleavappDetails() {
    return this.postsUpdated.asObservable();
  }
  getsug(postsPerPage: number, currentPage: number, empid: number) {
    const queryParams = `/${postsPerPage}/${currentPage}/${empid}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getsug' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getsugDetails() {
    return this.postsUpdated.asObservable();
  }
  getsugpending() {
    const uri = this.commonurl+'/callapi/getsugpending';
    return this.http.get(uri);
  }
  getconvpending() {
    const uri = this.commonurl+'/callapi/getconvpending';
    return this.http.get(uri);
  }
  getleaveapp() {
    const uri = this.commonurl+'/callapi/getleaveapp';
    return this.http.get(uri);
  }

  getallconven(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getallconven' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getallconvenDetails() {
    return this.postsUpdated.asObservable();
  }
  getallleavapp(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getallleavapp' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getallleavappDetails() {
    return this.postsUpdated.asObservable();
  }
  getallsug(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getallsug' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getallsugDetails() {
    return this.postsUpdated.asObservable();
  }
  public editconves(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/editconves', value);
  }
  public editleavapp(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/editleavapp', value);
  }
  public editsug(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/editsug', value);
  }
  public conveopenstatus(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/conveopenstatus', value);
  }
  public leavappeopenstatus(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/leavappeopenstatus', value);
  }
  public sugopenstatus(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/sugopenstatus', value);
  }
  public getpasswords() {
    const uri = this.commonurl+'/callapi/getpasswords';
    return this.http.get(uri);
  }
  getwhosecase() {
    const uri = this.commonurl+'/callapi/getwhosecase';
    return this.http.get(uri);

  }
  getBackendCustomerlist(postsPerPage: number, currentPage: number, sdate, edate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getBackendCustomerlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getBackendCustomerlistDetails() {
    return this.postsUpdated.asObservable();
  }
  getBackendBanklist(postsPerPage: number, currentPage: number, sdate, edate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getBackendBanklist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getBackendBanklistDetails() {
    return this.postsUpdated.asObservable();
  }
  getWebsiteLead(postsPerPage: number, currentPage: number, sdate, edate) {
    const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getWebsiteLead' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  getWebsiteLeadDetails() {
    return this.postsUpdated.asObservable();
  }
  savecomment(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/savecomment ';
    return this.http.post(uri, obj)
  }
  getweblead() {
    const uri = this.commonurl+'/callapi/getweblead';
    return this.http.get(uri);
  }
  public webleadopenstatus(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/webleadopenstatus', value);
  }
  downloadall(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/downloadall/ ';
    return this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }
  public earlygo(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/earlygo', value);
  }
  getEarlygo(postsPerPage: number, currentPage: number,empid: number) {

    const queryParams = `/${postsPerPage}/${currentPage}/${empid}`;
    const uri = this.commonurl+'/callapi/getEarlygo/' + queryParams;
    return this.http.get(uri);
  }
  getearlygocount() {
    const uri = this.commonurl+'/callapi/getearlygocount';
    return this.http.get(uri);
  }
  public earlygoopenstatus(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/earlygoopenstatus', value);
  }
  getallearlygo(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getallearlygo' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getallearlygoDetails() {
    return this.postsUpdated.asObservable();
  }
  getadminnewtelcount() {
    const uri = this.commonurl+'/callapi/getnewtelcount';
    return this.http.get(uri);
  }
  getnewtelcount(value) {
    const uri = this.commonurl+'/callapi/getnewtelcount1';
    return this.http.post(uri,value);
  }
  getnewappocount(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/getnewappocount';
    return this.http.post(uri, value);
  }
  public teldataopenstatus(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/teldataopenstatus', value);
  }
  public appointmentopenstatus(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/appointmentopenstatus', value);
  }
  downloadCount(value) {
    const uri = this.commonurl+'/callapi/downloadCount';
    return this.http.post(uri, value);
  }
  cimageUpload(value) {
    const uri = this.commonurl+'/callapi/cimageUpload';
    return this.http.post(uri, value);
  }
  getemployee() {
    const uri = this.commonurl+'/callapi/getemployee/';
    return this.http.get(uri);
  }
  individualNotification(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/individualNotification', value);
  }


  getteleemp() {
    const uri = this.commonurl+'/callapi/getteleemp/';
    return this.http.get(uri);
  }
  getbackendemp() {
    const uri = this.commonurl+'/callapi/getbackendemp/';
    return this.http.get(uri);
  }
  getaccemp() {
    const uri = this.commonurl+'/callapi/getaccemp/';
    return this.http.get(uri);
  }

  getdataentrtemp() {
    const uri = this.commonurl+'/callapi/getdataentrtemp/';
    return this.http.get(uri);
  }
  generalNotification(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/generalNotification', value);
  }
  getGroupNotification() {
    const uri = this.commonurl+'/callapi/getGroupNotification/';
    return this.http.get(uri);
  }
  getEmployeeNotification(value) {
    const uri = this.commonurl+'/callapi/getEmployeeNotification/' + value;
    return this.http.get(uri);
  }
  getnewnotification(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/getnewnotification';
    return this.http.post(uri, value);
  }
  opennotification(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/opennotification';
    return this.http.post(uri, value);
  }
  deleteNotification(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/callapi/deleteNotification', value);
  }
  getSeenBy(value) {
    console.log(value)
    const uri = this.commonurl+'/callapi/getSeenBy/' + value;
    return this.http.get(uri);
  }
  openSeenByDialog(id) {
    console.log(id);
    this.router.navigate(['/notification/seenby/' + id]);
  }
  gettodolist(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/gettodolist';
    return this.http.post(uri, value);
  }

  addToDo(value){
    console.log(value)
    const uri=this.commonurl+'/callapi/addToDo';
    return this.http.post(uri,value);
  }
  getToDo(value){
    console.log(value);
    const uri = this.commonurl+'/callapi/gettodo';
    return this.http.post(uri, value);
  }
  closetodo(value){
    console.log(value)
    const uri = this.commonurl+'/callapi/closetodo/' + value;
    return this.http.get(uri);
    
  }
  public getemailSettings() {
    const uri = this.commonurl+'/callapi/getemailSettings';
    return this.http.get(uri);
  }
  addEvent(value){
    console.log(value);
    const uri = this.commonurl+'/callapi/addEvent';
    return this.http.post(uri, value);
  }
  getEvent(){
      const uri = this.commonurl+'/callapi/getEvent';
  const res= this.http.get(uri);
   console.log(res);
    return res;
  }
  deleteEvent(value){
    console.log(value);
    const uri = this.commonurl+'/callapi/deleteEvent';
    return this.http.post(uri, value);
  }
  enquiryapprovecount(id) {
    const uri = this.commonurl+'/callapi/enquiryapprovecount/' + id;
    return this.http.get(uri);
  }
  enquirydisbursecount(id) {
    const uri = this.commonurl+'/callapi/enquirydisbursecount/' + id;
    return this.http.get(uri);
  }
  enquiryrejectcount(id) {
    const uri = this.commonurl+'/callapi/enquiryrejectcount/' + id;
    return this.http.get(uri);
  }
  getEnquiryDisburslistDetails(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquiryDisburslistDetailsDetails' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquiryDisburslistDetailsDetails() {
    return this.postsUpdated.asObservable();
  }
  getEnquiryApprovedlist(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquiryApprovedlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquiryApprovedlistDetails() {
    return this.postsUpdated.asObservable();
  }
  getEnquiryRejectlist(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquiryRejectlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquiryRejectlistDetails() {
    return this.postsUpdated.asObservable();
  }
  notopenedlist(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/notopenedlist';
    return this.http.post(uri, value);
  }
  filepickedlist(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/filepickedlist';
    return this.http.post(uri, value);
  }
  contactedlist(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/contactedlist';
    return this.http.post(uri, value);
  }
  loginlist(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/loginlist';
    return this.http.post(uri, value);
  }
  wiplist(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/wiplist';
    return this.http.post(uri, value);
  }
  approvedlist(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/approvedlist';
    return this.http.post(uri, value);
  }
  disbursedlist(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/disbursedlist';
    return this.http.post(uri, value);
  }
  rejectlist(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/rejectlist';
    return this.http.post(uri, value);
  }

  getEnquiryApprovelistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquiryApprovelistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquiryApprovelistexeDetails() {
    return this.postsUpdated.asObservable();
  }

  getEnquirycontactedlistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquirycontactedlistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquirycontactedlistexeDetails() {
    return this.postsUpdated.asObservable();
  }
  getEnquirydisburselistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquirydisburselistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquirydisburselistexeDetails() {
    return this.postsUpdated.asObservable();
  }
  getEnquiryfilepicklistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquiryfilepicklistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquiryfilepicklistexeDetails() {
    return this.postsUpdated.asObservable();
  }
  getEnquiryloginlistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquiryloginlistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquiryloginlistexeDetails() {
    return this.postsUpdated.asObservable();
  }
  getEnquirynotopenlistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquirynotopenlistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquirynotopenlistexeDetails() {
    return this.postsUpdated.asObservable();
  }
  getEnquiryrejectlistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquiryrejectlistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquiryrejectlistexeDetails() {
    return this.postsUpdated.asObservable();
  }
  getEnquirywiplistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquirywiplistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquirywiplistexeDetails() {
    return this.postsUpdated.asObservable();
  }
  notify(obj) {
    console.log(obj);
    // const queryParams = `/${obj}/${obj1}`;
    const uri = this.commonurl+'/callapi/notify';
    return this.http.post(uri, obj)
  }
  removeCase(obj) {
    console.log(obj);
    // const queryParams = `/${obj}/${obj1}`;
    const uri = this.commonurl+'/callapi/removeCase';
    return this.http.post(uri, obj)
  }
  nofallowup(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/nofallowup';
    return this.http.post(uri, value);
  }
  getEnquirynofollowuplistexe(postsPerPage: number, currentPage: number, id) {
    const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getEnquirynofollowuplistexe' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,

            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getEnquirynofollowuplistexeDetails() {
    return this.postsUpdated.asObservable();
  }
  mappedgetEvent(){
    const uri = this.commonurl+'/callapi/mappedgetEvent';
const res= this.http.get(uri);
 console.log(res);
  return res;
}
mappedgetEventDetails() {
  return this.postsUpdated.asObservable();
}
getEarlyGoStatus(obj) {
  console.log(obj);
  const uri = this.commonurl+'/callapi/getEarlyGoStatus';
  return this.http.post(uri, obj);

}
getLateInStatus(obj) {
  console.log(obj);
  const uri = this.commonurl+'/callapi/getLateInStatus';
  return this.http.post(uri, obj);

}
adminnotopenedlist() {
  const uri = this.commonurl+'/callapi/adminnotopenedlist';
  return this.http.get(uri);
}
adminfilepickedlist() {
  const uri = this.commonurl+'/callapi/adminfilepickedlist';
  return this.http.get(uri, );
}
admincontactedlist() {
  const uri = this.commonurl+'/callapi/admincontactedlist';
  return this.http.get(uri);
}
adminloginlist() {
  const uri = this.commonurl+'/callapi/adminloginlist';
  return this.http.get(uri);
}
adminwiplist() {
  const uri = this.commonurl+'/callapi/adminwiplist';
  return this.http.get(uri);
}
adminapprovedlist() {
  const uri = this.commonurl+'/callapi/adminapprovedlist';
  return this.http.get(uri);
}
adminnofallowup() {
  const uri = this.commonurl+'/callapi/adminnofallowup';
  return this.http.get(uri);
}
empgetallearlygo(postsPerPage: number, currentPage: number,id:number) {
  const queryParams = `/${postsPerPage}/${currentPage}/${id}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/empgetallearlygo' + queryParams
    )
    .pipe(
      map(postData => {
        return {
          posts: postData.posts,
          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}

empgetallearlygoDetails() {
  return this.postsUpdated.asObservable();
}

getEnquiryApprovelistexe1(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getEnquiryApprovelistexe1' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}
getEnquiryApprovelistexeDetails1() {
  return this.postsUpdated.asObservable();
}

getEnquirycontactedlistexe1(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getEnquirycontactedlistexe1' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}
getEnquirycontactedlistexeDetails1() {
  return this.postsUpdated.asObservable();
}
getEnquirydisburselistexe1(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getEnquirydisburselistexe1' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}
getEnquirydisburselistexeDetails1() {
  return this.postsUpdated.asObservable();
}
getEnquiryfilepicklistexe1(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getEnquiryfilepicklistexe1' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}
getEnquiryfilepicklistexeDetails1() {
  return this.postsUpdated.asObservable();
}
getEnquiryloginlistexe1(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getEnquiryloginlistexe1' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}
getEnquiryloginlistexeDetails1() {
  return this.postsUpdated.asObservable();
}
getEnquirynotopenlistexe1(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getEnquirynotopenlistexe1' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}
getEnquirynotopenlistexeDetails1() {
  return this.postsUpdated.asObservable();
}
getEnquiryrejectlistexe1(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getEnquiryrejectlistexe1' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}
getEnquiryrejectlistexeDetails1() {
  return this.postsUpdated.asObservable();
}
getEnquirywiplistexe1(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getEnquirywiplistexe1' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}
getEnquirywiplistexeDetails1() {
  return this.postsUpdated.asObservable();
}
getEnquirynofollowuplistexe1(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getEnquirynofollowuplistexe1' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}
getEnquirynofollowuplistexeDetails1() {
  return this.postsUpdated.asObservable();
}
getadminEnquirylist(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getadminEnquirylist' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}


getadminEnquirylistDetails() {
  return this.postsUpdated.asObservable();
}
getNotificationById(value) {
  console.log(value)
  const uri = this.commonurl+'/callapi/getNotificationById';
  return this.http.post(uri,value);
}
getAllNotificationById(value) {
  console.log(value)
  const uri = this.commonurl+'/callapi/getAllNotificationById/'+value;
  return this.http.get(uri);
}
gettodo1(value){
  const uri=this.commonurl+'/callapi/gettodo1/'+value;
  return this.http.get(uri);
}
addvisitor(obj) {
  console.log(obj);
  const uri = this.commonurl+'/callapi/addvisitor';
  return this.http.post(uri, obj)
}
getvisitorcount() {
  const uri = this.commonurl+'/callapi/getvisitorcount';
  return this.http.get(uri);
}
getAllVisitors(postsPerPage: number, currentPage: number) {
  const queryParams = `/${postsPerPage}/${currentPage}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getAllVisitors' + queryParams
    )
    .pipe(
      map(postData => {
        return {
          posts: postData.posts,
          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}

getAllVisitorsDetails() {
  return this.postsUpdated.asObservable();
}
respondVisitor(value){
  console.log(value);
    return this.http.post(this.commonurl+'/callapi/respondVisitor', value);
}
public visitoropenstatus(value) {
  console.log(value);
  return this.http.post(this.commonurl+'/callapi/visitoropenstatus', value);
}
editBackend(id) {
  console.log(id);
  this.router.navigate(['/backend/editroutine/' + id]);
}

getexecutivelistWithBranch(value) {

  const uri = this.commonurl+'/callapi/getexecutivelistWithBranch/'+value;
  return this.http.get(uri);
}
getheadofficeEmployee() {

  const uri = this.commonurl+'/callapi/getheadofficeEmployee/';
  return this.http.get(uri);
}
getBackendroutinelist(postsPerPage: number, currentPage: number, sdate, edate) {
  const queryParams = `/${postsPerPage}/${currentPage}/${sdate}/${edate}`;
  this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      this.commonurl+'/callapi/getBackendroutinelist' + queryParams
    )
    .pipe(
      map(postData => {
        //console.log('');
        return {
          posts: postData.posts,

          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
}


getBackendroutinelistDetails() {
  return this.postsUpdated.asObservable();
}
getallexecutivelist() {

  const uri = this.commonurl+'/callapi/getallexecutivelist/';
  return this.http.get(uri);
}
}
