import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../common.service';
import { DefaultLayoutComponent } from '../../containers';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-backend',
    templateUrl: './seenby_dialog.html',
})
export class SeenByComponent implements OnInit {
    model: any = {};
    model1: any = {};
    empid: any;
    empname: any;
    fetchData: any;
    fetchData1: any;
    idvalue:any;
    constructor(private route: ActivatedRoute, private router: Router,
        private commonservice: CommonService, public defaultlayout: DefaultLayoutComponent,
        private dialog: MatDialog
    ) { }
    isCollapsed: boolean = false;

    ngOnInit() {
        this.route.params.subscribe(params=>{
            console.log(params['id']);
            this.idvalue = params['id'];
            this.commonservice.getSeenBy(params['id']).subscribe(res => {
              console.log(res);
              this.fetchData=res;
            });
          })
        // this.empid = localStorage.getItem("id");
        // this.empname = localStorage.getItem("empname");
        // this.idvalue = params['id'];
        // this.commonservice.getSeenBy().subscribe(res => {
        //     console.log(res);
        //     this.model = res;
        // });
    }
    refresh(): void {
        window.location.reload();
    }
}
