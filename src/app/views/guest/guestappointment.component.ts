import { Component, ElementRef, OnInit, Renderer2, ViewChild  } from '@angular/core';
import { CommonService } from '../../common.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';



@Component({
  templateUrl: './guestappointment.component.html',
})

export class GuestAppointmentComponent implements OnInit{
  @ViewChild('video') videoElement: ElementRef;
    @ViewChild('canvas') canvas: ElementRef;
 
  constructor(private commonservice: CommonService,private router:Router,private renderer: Renderer2) { }

  model: any = {};
  fetchData:any;
  fetchData1:any;
  dataURL:any;
  image:any;
  value1:any;
  videoWidth = 0;
    videoHeight = 0;
    constraints = {
        video: {
            facingMode: "user",
            width: { ideal: 4096 },
            height: { ideal: 2160 }
        }
    };


  ngOnInit() {
    this.startCamera();
    
    this.commonservice.getteamhead().subscribe(res => {
      console.log(res);
      this.fetchData1 = res;
    });

    this.commonservice.getemailSettings().subscribe(res=>{
      console.log(res);
      this.fetchData =res;

    })
  }
  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) { 
  navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    
} else {
        alert('Sorry, camera not available.');
    }
  }
   attachVideo(stream) {
        this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
        this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
            this.videoHeight = this.videoElement.nativeElement.videoHeight;
            this.videoWidth = this.videoElement.nativeElement.videoWidth;
        });
     
    }

    capture() {
        this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
        this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
        console.log(this.videoElement.nativeElement, 0, 0)
        this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
       
         this.dataURL = this.canvas.nativeElement.toDataURL('image/jpeg', 1.0);
        console.log(this.dataURL);
    }

    handleError(error) {
        console.log('Error: ', error);
    }
  submitForm(value) {
   console.log(value)
   console.log(value);
   this.value1 = { value: value, visitorPhoto: this.dataURL,emails:this.fetchData };
   this.commonservice.addvisitor(this.value1).subscribe(res => {
     console.log(res);
     alert("Appointment sent Successfully\n please check your email id for Response");
     this.redirect()
  })
}
  redirect(){
    this.router.navigate(["/guest/home"]);
  }
 
  
}