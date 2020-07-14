import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class MemberService {
  commonurl = 'http://test.mindfin.co.in';
  constructor(private http: HttpClient, private router: Router) { }
  login(loginvalue) {
    console.log(loginvalue);
    const uri = this.commonurl+'/member/memberlogin/';
    // return this.http.post(uri,obj);
    this.http.post(uri, loginvalue).subscribe(res => {
      console.log(res);
      if (res == null) {
        alert("Invalid Email Or Password");
        window.location.reload();
      }
      else {
        localStorage.setItem('id', res[0]['idmember']);
        localStorage.setItem('role', 'member');
        this.router.navigate(["/member/home"]);
      }
    });
  }

  getsinglemember(id) {
    console.log(id);
    const uri = this.commonurl+'/member/getsinglemember/' + id;
    return this.http.get(uri);
  }

  homememberlist(memberid) {
    console.log(memberid);
    const uri = this.commonurl+'/member/homememberlist/' + memberid;
    return this.http.get(uri);
  }

  myprojectlist(memberid) {
    console.log(memberid);
    const uri = this.commonurl+'/member/myprojectlist/' + memberid;
    return this.http.get(uri);
  }

  changepwd(obj) {
    console.log(obj);
    const uri = this.commonurl+'/member/changepwd/';
    this.http.post(uri, obj).subscribe(res => {
      console.log(res);
      if (res['status'] == true) {
        alert("PASSWORD CHANGED!!!");
        this.router.navigate(["/login"]);
      }
      else {
        alert("SORRY SOMETHING WENT WRONG!!!");
      }
    });
  }

  checkcurrentpwd(obj) {
    console.log(obj);
    const uri = this.commonurl+'/member/checkcurrentpwd';
    return this.http.post(uri, obj);

  }
  public uploadImage(file) {
    console.log(file)
    return this.http.post(this.commonurl+'/member/image-upload', file);
  }
  bankstatementcam(value) {
    console.log(value);
    return this.http.post(this.commonurl+'/member/bankstatementcam', value);

  }
  itrcam(value) {
    console.log(value);
    const uri = this.commonurl+'/callapi/itrcam';
    return this.http.post(uri, value)
  }
}
