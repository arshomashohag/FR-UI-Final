import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import * as baseLocation from '../../config/base_location.json';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { MenuFlagService } from '../menu-flag.service';
import { Subscription } from 'rxjs';
import { HomeDataService } from '../home-data.service';
import { SearchedValueService } from '../searched-value.service';
declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  masterCategory: any;
  subCategory: any;
  articleType: any;
  gender: any;
  color: any;
  imageId: any;

  elementsPerPage: any;
  apiLink: string = baseLocation.base_backoffice;
  homeValueSubs: Subscription;
  subscription: Subscription;
  searchedValueSubscriber: Subscription;
  // masterCategories: any;
  // subCategories: any;
  articleTypes: any;
  genders: any;
  colours: any;
  isImageSearching: boolean;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private menuService: MenuFlagService,
    private homeService: HomeDataService,
    private searchedProductService: SearchedValueService
  ) { }

  products: any;

  ngOnInit() {
    this.elementsPerPage = 9;
    // this.masterCategories = [];
    // this.subCategories = [];
    this.articleTypes = [];
    this.genders = [];
    this.colours = [];
    this.products = [];

    this.menuService.addData({ 'category': false, 'home': false, 'product': true });
    this.route.queryParams.subscribe(
      (params: any) => {
        console.log('Eseche - query');

        this.masterCategory = params['master_category'];
        this.subCategory = params['sub_category'];
        this.color = params['color'];
        this.imageId = params['image_id'];
        this.articleType = params['article_type'];
        this.gender = params['gender'];


        if (this.masterCategory || this.subCategory || this.color || this.articleType || this.gender) {

          this.searchProducts(true);

        } else if (this.imageId) {

          this.searchByProductId(true);

        }

        this.isImageSearching = this.masterCategory || this.subCategory || this.color || this.articleType || this.gender || this.imageId

        this.fetchFromCache(!this.isImageSearching);



      }
    );

     
  }

  ngAfterViewInit() {
    $(".filters-list").niceScroll(".categor-list", { fixed: true });
    $(".products-page").niceScroll(".row", { fixed: true, horizrailenabled: false });

    $('select').niceSelect();

    $('.preloader').delay(2).fadeOut('slow', function () {
      $(this).hide();

    });
  }

  fetchFromCache(productsFlag: boolean) {
    console.log('called');
    this.homeValueSubs = this.homeService.getData().subscribe(
      (data: any) => {
        if (data.images) {

          if (productsFlag) {
            this.products = data.images;
            this.paginateProductsItems();
          }

          if (!this.masterCategory) {

            this.masterCategory = 'All products';

          }

        }

        // if (data.master_category) {

        //   this.masterCategories = data.master_category;
        //   this.masterCategories.sort();
        //   this.masterCategories = this.masterCategories.filter((el) => {
        //     return el.trim() != ""
        //   })
        // }

        // if (data.sub_category) {
        //   this.subCategories = data.sub_category;
        //   this.subCategories.sort();
        //   this.subCategories = this.subCategories.filter((el) => {
        //     return el.trim() != ""
        //   })
        // }

        if (data.article_type) {
          this.articleTypes = data.article_type;
          this.articleTypes.sort();
          this.articleTypes = this.articleTypes.filter((el) => {
            return el.trim() != ""
          })
        }

        if (data.gender) {
          this.genders = data.gender;
          this.genders.sort();
          this.genders = this.genders.filter((el) => {

            return el.trim() != ""
          })
        }

        if (data.base_colour) {
          this.colours = data.base_colour;
          this.colours.sort();
          this.colours = this.colours.filter((el) => {
            return el.trim() != ""
          })
        }

      }
    );
  }

  searchByProductId(flag) {

    if (!this.imageId) {
      return;
    }

    if (!flag) {

      $('.preloader').fadeIn('slow', function () {
        $(this).show();

      });
    }

    this.subscription = this.apiService.fetchRecommendations(this.imageId).subscribe(
      (data: any) => {

        if (data.success) {
          this.products = data.data;
          let first_item = data.query_image;
          console.log(first_item);
          this.masterCategory = first_item['masterCategory'];
          this.subCategory = first_item['subCategory'];
          this.gender = first_item['gender'];
          this.color = first_item['baseColour'];
          this.articleType = first_item['articleType'];

          this.paginateProductsItems();

        } else {
          console.log(data.message);
          alert(data.message);
        }
      },
      (error: any) => {

      },
      () => {

        $('.preloader').fadeOut('slow', function () {
          $(this).hide();

        });
      }
    );

  }

  searchProducts(flag) {
    let data = new FormData();

    if (this.masterCategory && this.masterCategory != "All products") {
      data.set('master_category', this.masterCategory);
    }

    if (this.subCategory) {
      data.set('sub_category', this.subCategory)
    }

    if (this.gender) {
      data.set('gender', this.gender)
    }

    if (this.color) {
      data.set('base_colour', this.color)
    }

    if (this.articleType) {
      data.set('article_type', this.articleType);
    }

    if (!flag) {

      $('.preloader').fadeIn('slow', function () {
        $(this).show();

      });
    }


    this.apiService.searchForProduct(data).subscribe(
      (data: any) => {

        if (data.success) {

          this.products = data.data
          this.paginateProductsItems()

        } else {

          alert(data.message);
        }

      },
      (error: any) => {

      },
      () => {

        $('.preloader').fadeOut('slow', function () {
          $(this).hide();

        });
      }
    )


  }


  private paginateProductsItems() {
    let container = $('#products-pagination-container');



    container.pagination({
      dataSource: this.products,
      pageSize: this.elementsPerPage,
      className: 'paginationjs-theme-yellow paginationjs-big',
      callback: (data, pagination) => {
        // template method of yourself
        var html = this.template(data);
        $('#products-data-container').html(html);
        $(".default-img, .product-name").on('click', (e) => {

          e.preventDefault();
          console.log($(e.target).attr('image_id'));
          this.imageId = $(e.target).attr('image_id');
          this.searchByProductId(false);

        });
      }
    })

  }

  private template(data) {
    var html = '';

    if (data.length <= 0) {
      html = `<div class="col-12 not-found-warning">
                <div class="alert alert-warning" role="alert">
                  No item found! Reset filters and try again!
                </div>
              </div>`
    }
    $.each(data, (index, item) => {

      html += `<div class="col-lg-4 col-md-6 col-12">
                <div class="single-product">
                  <div class="product-img">
                    <a href="">
                      <img class="default-img" image_id="${item.id}" src="${this.apiLink + '/images/' + item.id}" alt="#">
                    </a>
                    <div class="button-head">
                      <div class="product-action">
                        <a data-toggle="modal" data-target="#exampleModal" title="Quick View"><i class=" ti-eye"></i><span>Quick Shop</span></a>
                        <a title="Wishlist"><i class=" ti-heart "></i><span>Add to Wishlist</span></a>
                        <a title="Compare"><i class="ti-bar-chart-alt"></i><span>Add to Compare</span></a>
                      </div>
                      <div class="product-action-2">
                        <a title="Add to cart">Add to cart</a>
                      </div>
                    </div>
                  </div>
                  <div class="product-content">
                    <h3><a class="product-name" image_id="${item.id}" >${item.productDisplayName}</a></h3>
                    <div class="product-price">
                      <span>$29.00</span>
                    </div>
                  </div>
                </div>
              </div>`
    });

    return html;
  }

  filter(event, type, value) {
    event.preventDefault();



    console.log(type, value);

    if (type == 'gender') {
      if (value != this.gender) {
        this.gender = value

      } else {
        this.gender = "";
      }

    }

    if (type == 'color') {

      if (value != this.color) {
        this.color = value
      } else {
        this.color = "";
      }

    }

    if (type == 'article') {

      if (value != this.articleType) {
        this.articleType = value
      } else {
        this.articleType = "";
      }

    }

    this.searchProducts(false);

  }

  resetFilters(e) {
    e.preventDefault();
    this.masterCategory = "";
    this.articleType = "";
    this.subCategory = "";
    this.gender = "";
    this.color = "";
  }

  ngOnDestroy() {

    if (this.subscription) {

      this.subscription.unsubscribe();
    }

    if (this.searchedValueSubscriber) {

      this.searchedValueSubscriber.unsubscribe();
    }

  }

}
