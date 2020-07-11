import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private service: CommonService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = localStorage.getItem('role');
    const isAdmin = localStorage.getItem('desc')
    console.log(isAuth);
    // console.log(next.paramMap.get('id'));
    if (isAuth == 'SUPERADMIN') {
      if (state.url == '/member/home'
        || state.url == '/member/profile' || state.url == 'member/customerprofile'
      ) {
        this.router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    }
    else if (isAuth == 'ADMIN') {
      if (state.url == '/member/profile' || state.url == 'member/customerprofile'
      ) {
        this.router.navigate(['/member/home']);
        return false;
      } else {
        return true;
      }
    }
    else if (isAuth == 'EXECUTIVE' && isAdmin == 'Admin') {
      if (state.url == '/member/profile' || state.url == 'member/customerprofile'
      ) {
        this.router.navigate(['/member/home']);
        return false;
      } else {
        return true;
      }
    }
    else if (isAuth == 'EXECUTIVE' && isAdmin != 'Admin') {
      if (state.url == '/dashboard' || state.url == '/members/add' || state.url == '/members/approval' ||
        state.url == '/members/employee' || state.url == '/members/employeelist' || next.paramMap.get('id') != null ||
        state.url == '/members/viewexecutive' || state.url == '/members/memberlist'
        || state.url == '/members/bank' || state.url == '/members/loantype' || state.url == '/members/user'
        || state.url == '/members/employeetype' || state.url == '/approval/add' || state.url == '/approval/edit'
        || state.url == '/account/subvendor'
        || state.url == '/account/disburselist' || state.url == '/dashboard/dataentry'
      ) {
        this.router.navigate(['/dashboard/executive']);
        return false;
      } else {
        return true;
      }

      // return true;
    }
    else if (isAuth == 'TELECALLER') {

      if (state.url == '/dashboard'
        || state.url == '/addcustomer' || state.url == '/members/add' || state.url == '/members/approval'
        || state.url == '/members/pdlist' || state.url == ' /members/datatelelist'
        || state.url == '/members/approve' || state.url == '/members/disbursed'
        || state.url == '/members/employee' || state.url == '/members/employeelist' || state.url == '/members/viewexecutive'
        || state.url == '/members/bank' || state.url == '/members/loantype' || state.url == '/members/user'
        || state.url == '/members/employeetype'
        || state.url == '/members/approval' || state.url == '/dashboard/dataentry' || state.url == '/account/subvendor'
        || state.url == '/account/disburselist'
      ) {
        this.router.navigate(['dashboard/telecaller']);
        return false;
      } else {
        return true;
      }
    }
    else if (isAuth == 'GUEST') {

      if (state.url == '/dashboard'
        || state.url == '/addcustomer' || state.url == '/members/add' || state.url == '/members/approval'
        || state.url == '/members/pdlist' || state.url == ' /members/datatelelist'
        || state.url == '/members/approve' || state.url == '/members/disbursed'
        || state.url == '/members/employee' || state.url == '/members/employeelist' || state.url == '/members/viewexecutive'
        || state.url == '/members/bank' || state.url == '/members/loantype' || state.url == '/members/user'
        || state.url == '/members/employeetype'
        || state.url == '/members/approval' || state.url == '/dashboard/dataentry' || state.url == '/account/subvendor'
        || state.url == '/account/disburselist'
      ) {
        this.router.navigate(['/guest/home']);
        return false;
      } else {
        return true;
      }
    }
    else if (isAuth == 'DATA ENTRY') {

      if (state.url == '/dashboard' || state.url == '/member/addenquiry'
        || state.url == '/members/bank' || state.url == '/members/loantype' || state.url == '/members/user'
        || state.url == '/members/employeetype'
        || state.url == '/approval/add' || state.url == '/dashboard/telecaller' || state.url == '/account/subvendor'
        || state.url == '/account/disburselist' || state.url == '/executives/exeteledatalist'
        || state.url == '/executives/dailyroutine' || state.url == '/executives/dailyroutineview'
        || state.url == '/executives/customer' || state.url == '/executives/customer'
        || state.url == '/executives/editroutine/' || state.url == '/telcaller/addenquiry'
        || state.url == '/telcaller/teledatalist' || state.url == '/loginoperation/loginoperation'
      ) {
        this.router.navigate(['dashboard/dataentry']);
        return false;
      } else {
        return true;
      }
    }
    else if (isAuth == 'ACCOUNTANT') {

      if (state.url == '/addcustomer' || state.url == '/members/add' || state.url == '/members/approval'
        || state.url == '/members/pdlist' || state.url == ' /members/datatelelist'
        || state.url == '/members/approve' || state.url == '/members/disbursed'
        || state.url == '/members/employee' || state.url == '/members/employeelist' || state.url == '/members/viewexecutive'
        || state.url == '/members/bank' || state.url == '/members/loantype' || state.url == '/members/user'
        || state.url == '/members/employeetype'
        || state.url == '/members/approval' || state.url == '/dashboard/dataentry'

      ) {
        this.router.navigate(['account/subvendor']);
        return false;
      } else {
        return true;
      }
    }

    else if (isAuth == 'CUSTOMER') {
      if (state.url == '/dashboard'
        || state.url == '/addcustomer' || state.url == '/members/add' || state.url == '/members/approval'
        || state.url == '/members/pdlist' || state.url == ' /members/datatelelist'
        || state.url == '/members/approve' || state.url == '/members/disbursed' || state.url == '/dashboard/telecaller'
        || state.url == '/members/employee' || state.url == '/members/employeelist' || state.url == '/members/viewexecutive'
        || state.url == '/members/bank' || state.url == '/members/loantype' || state.url == '/members/user'
        || state.url == '/members/employeetype' || state.url == '/member/addenquiry'
        || state.url == '/members/approval' || state.url == '/dashboard/dataentry' || state.url == '/account/subvendor'
        || state.url == '/account/disburselist'


      ) {
        this.router.navigate(['member/customerprofile']);
        return false;
      } else {
        return true;
      }
    }
    else if (isAuth == 'LOGIN') {
      if (state.url == '/dashboard'
        || state.url == '/addcustomer' || state.url == '/members/add' || state.url == '/members/approval'
        || state.url == '/members/pdlist' || state.url == ' /members/datatelelist'
        || state.url == '/members/approve' || state.url == '/members/disbursed' || state.url == '/dashboard/telecaller'
        || state.url == '/members/employee' || state.url == '/members/employeelist' || state.url == '/members/viewexecutive'
        || state.url == '/members/bank' || state.url == '/members/loantype' || state.url == '/members/user'
        || state.url == '/members/employeetype' || state.url == '/member/addenquiry'
        || state.url == '/members/approval' || state.url == '/dashboard/dataentry' || state.url == '/account/subvendor'
        || state.url == '/account/disburselist'


      ) {
        this.router.navigate(['dashboard/login']);
        return false;
      } else {
        return true;
      }
    }
    else if (isAuth == 'BACKEND') {
      if (state.url == '/dashboard'
        || state.url == '/addcustomer' || state.url == '/members/add' || state.url == '/members/approval'
        || state.url == '/members/pdlist' || state.url == ' /members/datatelelist'
        || state.url == '/members/approve' || state.url == '/members/disbursed' || state.url == '/dashboard/telecaller'
        || state.url == '/members/employee' || state.url == '/members/employeelist'
        || state.url == '/members/bank' || state.url == '/members/loantype' || state.url == '/members/user'
        || state.url == '/members/employeetype' || state.url == '/member/addenquiry'
        || state.url == '/members/approval' || state.url == '/dashboard/dataentry' || state.url == '/account/subvendor'
        || state.url == '/account/disburselist'


      ) {
        this.router.navigate(['/member/home']);
        return false;
      } else {
        return true;
      }
    }

    else {
      this.router.navigate(['/login']);
    }
  }
}


