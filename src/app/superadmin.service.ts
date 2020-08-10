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

export class SuperadminService {
  commonurl = 'https://test.mindfin.co.in';
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


  getintroducer1() {
    const uri = this.commonurl+'/superadmin/getintroducer1';
    //console.log('');
    return this.http.get(uri)
  }

  addintroducer1(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/addintroducer1/';
    return this.http.post(uri, obj).subscribe(res => {
    })
  }

  getintroducer2() {
    const uri = this.commonurl+'/superadmin/getintroducer2';
    //console.log('');
    return this.http.get(uri)
  }

  addintroducer2(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/addintroducer2/';
    return this.http.post(uri, obj).subscribe(res => {
    })
  }
  // gettransfer(postsPerPage: number, currentPage: number){
  //     console.log("member");
  //     const queryParams = `/${postsPerPage}/${currentPage}`;
  //     this.http
  //       .get<{ message: string; posts: any; maxPosts: number }>(
  //         this.commonurl+'/callapi/gettransfer" + queryParams
  //       )
  //       .pipe(
  //         map(postData => {
  //           //console.log('');
  //           return {
  //             posts: postData.posts,
  //             maxPosts: postData.maxPosts
  //           };
  //         })
  //       ).subscribe(transformedPostData => {
  //         this.posts = transformedPostData.posts;
  //         this.postsUpdated.next({
  //           posts: [...this.posts],
  //           postCount: transformedPostData.maxPosts
  //         });
  //       });
  //   }

  gettransfer(postsPerPage: number, currentPage: number) {
    console.log("member");
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/superadmin/gettransfer' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      ).subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  gettransferdetails() {
    return this.postsUpdated.asObservable();
  }


  approvemember(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/approvemember/';
    return this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }



  getMemberr(postsPerPage: number, currentPage: number) {
    console.log("member");
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/superadmin/memberlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      ).subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }



  getmemberdetails() {
    return this.postsUpdated.asObservable();
  }

  rejectmember(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/rejectmember/';
    return this.http.post(uri, obj).subscribe(res => {
    })
  }

  rejecteditmember(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/rejecteditmember/';
    return this.http.post(uri, obj).subscribe(res => {
    })
  }

  geteditMember(postsPerPage: number, currentPage: number) {
    console.log("member");
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/superadmin/editmemberlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      ).subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }


  editapprovemember(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/editapprovemember/';
    return this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }


  getdeleteMember(postsPerPage: number, currentPage: number) {
    console.log("member");
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/superadmin/getdeleteMember' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      ).subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  deleteapprovemember(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/deleteapprovemember/';
    return this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }
  rejectdeletemember(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/rejectdeletemember/';
    return this.http.post(uri, obj).subscribe(res => {
    })
  }
  gett(id) {
    console.log(id);
    this.router.navigate(["/viewreceipt/" + id]);

  }
  gete(id) {
    console.log(id);
    this.router.navigate(["/booking/edit/" + id]);

  }
  deletebooking(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/deletebooking/';
    return this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  gethistoryMember(postsPerPage: number, currentPage: number) {
    console.log("member");
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/superadmin/gethistoryMember' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      ).subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getReceiptapproval(postsPerPage: number, currentPage: number) {
    console.log("member");
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/superadmin/getReceiptapproval' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      ).subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  approvereceipt(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/approvereceipt/';
    return this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }
  rejectreceipt(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/rejectreceipt/';
    return this.http.post(uri, obj).subscribe(res => {
    })
  }
  getSeniorityid() {
    const uri = this.commonurl+'/superadmin/getseniorityid';
    return this.http.get(uri);
  }

  getseniordetails(id) {
    const uri = this.commonurl+'/superadmin/getseniordetails/' + encodeURIComponent(id);
    return this.http.get(uri);
  }

  updateplot(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/updateplot';
    this.http.post(uri, obj).subscribe(res => {
      // console.log(res);
    })
  }

  gettransferapproval(postsPerPage: number, currentPage: number) {
    console.log("member");
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/superadmin/gettransferapproval' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      ).subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  approvetransfer(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/approvetransfer/';
    return this.http.post(uri, obj).subscribe(res => {
      //console.log('');
    })
  }

  rejecttransfermember(obj) {
    console.log(obj);
    const uri = this.commonurl+'/superadmin/rejecttransfermember/';
    return this.http.post(uri, obj).subscribe(res => {
    })
  }


  getMember(postsPerPage: number, currentPage: number, id: String, psize: String, fdate, tdate, ndays, introducer1: String, introducer2: String, lamount: String) {
    console.log(id);
    const queryParams = `/${postsPerPage}/${currentPage}/${id}/${psize}/${fdate}/${tdate}/${ndays}/${introducer1}/${introducer2}/${lamount}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/memberlist' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            // .map(post => {
            //   return {
            //     airwaybill_no : post.airwaybill_no,
            //     order_no : post.order_no,
            //     product_type : post.product_type,
            //     consignee : post.consignee
            //   };
            // }),
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
  getmemberrdetails() {
    return this.postsUpdated.asObservable();
  }

  getallrecipts(postsPerPage: number, currentPage: number, mode, stat, fdate, tdate) {
    console.log("member");
    const queryParams = `/${postsPerPage}/${currentPage}/${mode}/${stat}/${fdate}/${tdate}/`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.commonurl+'/callapi/getallreceipts' + queryParams
      )
      .pipe(
        map(postData => {
          //console.log('');
          return {
            posts: postData.posts,
            maxPosts: postData.maxPosts
          };
        })
      ).subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getallreciptsdetails() {
    return this.postsUpdated.asObservable();
  }
  editaffidivate(obj) {
    console.log(obj);
    const uri = this.commonurl+'/callapi/editaffidivate/';
    return this.http.post(uri, obj);
    // .subscribe(res=>{
    //   console.log(res);
    // })
  }

  getaffidivate() {
    const uri = this.commonurl+'/superadmin/getaffidivate';
    return this.http.get(uri);
  }


  login(loginvalue) {
    console.log(loginvalue);
    const uri = this.commonurl+'/superadmin/superadmin/';
    // return this.http.post(uri,obj);
    this.http.post(uri, loginvalue).subscribe(res => {
      // console.log(res[0]['adminid']);

      if (res == null || res == undefined || res == 0) {

        alert("Invalid Username Or Password");

        window.location.reload();

      }
      else {

        console.log("hi")
        localStorage.setItem('id', res[0]['adminid']);
        localStorage.setItem('role', 'ojnebsfqvt');
        this.router.navigate(["/dashboard"]);



      }
    });
  }



  presidentlist1() {
    const uri = this.commonurl+'/superadmin/presidentlist1';
    return this.http.get(uri);
  }


  getCustomer(postsPerPage: number, currentPage: number) {
    const queryParams = `/${postsPerPage}/${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>( 
        this.commonurl+'/callapi/customerlist' + queryParams
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


  getCustomerDetails() {
    return this.postsUpdated.asObservable();
  }



}
