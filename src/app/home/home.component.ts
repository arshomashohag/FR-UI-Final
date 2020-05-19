import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HomeDataService } from '../home-data.service';

import * as baseLocation from '../../config/base_location.json';
import { MenuFlagService } from '../menu-flag.service';


declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private homeService: HomeDataService,
    private menuService: MenuFlagService
  ) { }

  products: any;
  productDetails: any;
  keyword = 'name';
  busy: Subscription;
  homeValueSubs: Subscription;
  caresoulInitiated: boolean;

  apiLink: string = baseLocation.base_backoffice;

  trendingItems: any;
  middleBanner: any = [];

  masterCategories: any;
  masterCategory: any;
  masterCatFocus: any;

  subCategories: any;
  subCategory: any;
  subCatFocus: any;

  articleTypes: any;
  articleType: any;
  typeFocus: any;

  baseColours: any;
  color: any;
  colorFocus: any;

  genders: any;
  gender: any;

  searchedImage: any;
  carouselOptions: any;

  p: any;

  ngOnInit() {
    this.caresoulInitiated = false;
    this.masterCategories = [];
    this.products = [];

    this.homeService.getData().subscribe(
      (data: any) => {
        if (data.images) {
          this.products = data.images.slice(0, 10);
        }
        if (data.master_category) {

          this.masterCategories = data.master_category;
        }

        if (data.trending) {

          let trending_items = data.trending
          this.trendingItems = {}

          trending_items.forEach(item => {

            if (!this.trendingItems[item.masterCategory]) {
              this.trendingItems[item.masterCategory] = []
            }

            this.trendingItems[item.masterCategory].push(item);

          });

          console.log(this.trendingItems);

        }
      },
      (error: any) => {

      },
      () => {
      }
    );

    this.menuService.addData({ 'category': true, 'home': true, 'product': false })

    // $("body").click((e) => {
    //   this.masterCatFocus = false;
    //   this.subCatFocus = false;
    //   this.typeFocus = false;
    //   this.colorFocus = false;

    //   if (e.target.id == "master-category") {
    //     this.masterCatFocus = true
    //   } else if (e.target.id == "sub-category") {
    //     this.subCatFocus = true
    //   } else if (e.target.id == "article-type") {
    //     this.typeFocus = true
    //   } else if (e.target.id == "base-color") {
    //     this.colorFocus = true
    //   }
    // });

    this.carouselOptions = {
      items: 1,
      autoplay: true,
      autoplayTimeout: 5000,
      smartSpeed: 400,
      animateIn: 'fadeIn',
      animateOut: 'fadeOut',
      autoplayHoverPause: true,
      autoWidth: true,
      nav: true,
      loop: true,
      merge: true,
      dots: false,
      navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
      responsive: {
        0: {
          items: 1
        },
        400: {
          items: 2
        },
        740: {
          items: 3
        },
        940: {
          items: 4
        }
      }
    };


    $('.preloader').delay(1000).fadeOut('slow', function () {
      $(this).hide();
    });

  }
  ngAfterViewInit() {


  }

  initiateCarousel(index) {

    if (!this.caresoulInitiated) {
      this.caresoulInitiated = true;
      console.log('Called last item - ', index)
      $('.popular-slider').owlCarousel({
        items: 1,
        autoplay: true,
        autoplayTimeout: 5000,
        smartSpeed: 400,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        autoplayHoverPause: true,
        nav: true,
        loop: true,
        merge: true,
        dots: false,
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        responsive: {
          0: {
            items: 1,
          },
          300: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1170: {
            items: 4,
          },
        }
      });

    }

    return '';
  }

  showDetails(type, event) {

    if (type == 'in') {

      $(event.target.parentElement).next().addClass('card-show')

    } else {

      $(event.target.parentElement).next().removeClass('card-show')

    }

  }



  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

}
