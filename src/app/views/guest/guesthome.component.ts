import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../common.service';
declare let $: any;
@Component({
  templateUrl: 'guesthome.component.html'
  // styleUrls: [ './guesthome.component.css' ]
})
export class GuestHomeComponent implements AfterViewInit {
 
  // constructor(private route: ActivatedRoute
  //   , private router: Router, private service: CommonService) { }
  // ngOnInit() {
    
  // }
    ngAfterViewInit(){
    $('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    pagination: false,
    dots:false,
    autoplay:true,
    autoplayTimeout:2000,
    slideSpeed : 500,
    responsiveClass:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:5
        }
    }
})
$('#achievements').owlCarousel({
  loop:true,
  margin:10,
  nav:false,
  pagination: false,
  dots:false,
  autoplay:true,
  autoplayTimeout:3000,
  slideSpeed : 500,
  responsiveClass:true,
  responsive:{
      0:{
          items:1
      },
      600:{
          items:3
      },
      1000:{
          items:5
      }
  }
})
  }
}