import { Component, OnInit, OnDestroy } from '@angular/core';

import * as baseLocation from '../../config/base_location.json';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuFlagService } from '../menu-flag.service';
import { Subscription } from 'rxjs';
import { SearchedValueService } from '../searched-value.service';
import { SearchModalService } from '../search-modal.service';
declare var $: any;

@Component({
  selector: 'app-searched-products',
  templateUrl: './searched.products.component.html',
  styleUrls: ['./searched.products.component.less']
})
export class SearchedProductsComponent implements OnInit, OnDestroy {
  articleType: any;
  similarity: any;
  gender: any;
  color: any;
  queryImageFileName: any;

  elementsPerPage: any;
  apiLink: string = baseLocation.base_backoffice;
  homeValueSubs: Subscription;
  subscription: Subscription;
  searchedValueSubscriber: Subscription;
  isImageSearching: boolean;
  searchedImage: any;

  detectedArticleTypes: any;

  constructor(
    private router: Router,
    private menuService: MenuFlagService,
    private searchedProductService: SearchedValueService,
    private searchModalService: SearchModalService
  ) { }

  products: any;

  ngOnInit() {
    this.elementsPerPage = 9;
    this.products = [];

    this.menuService.addData({ 'category': false, 'home': false, 'product': true });
    console.log('Initializing....')

    this.subscribeForSerchedProduct();

    $('select').niceSelect();

    $('.preloader').delay(2000).fadeOut('slow', function () {
      $(this).hide();

    });

     
  }

  subscribeForSerchedProduct() {
    console.log('Getting recommended products.....');
    this.searchedProductService.getData().subscribe(
      (data: any) => {
        if (data && data.success) {

          this.products = data.data;

          console.log(data.image)

          this.queryImageFileName = data.image;
          if (this.products.length > 0) {
            let firstProduct = this.products[0];
            this.articleType = firstProduct.articleType;
            this.similarity = firstProduct.similarity * 100;

            this.detectedArticleTypes = [];
            this.products.forEach(product => {
              this.detectedArticleTypes.push(product.articleType)
            });


            this.detectedArticleTypes = this.detectedArticleTypes.filter((item, pos) => {
              return this.detectedArticleTypes.indexOf(item) == pos;
            })
          }

          this.readURL();
          this.paginateItems();

        }
      },
      (error: any) => {
        console.log(error)
      },
      () => {
        console.log('Done...............')
      }
    )
  }

  changeFilters() {
    console.log('Change filter called');
    this.searchModalService.addData({ 'modal_flag': true })
  }

  private paginateItems() {

    let container = $('#pagination-container');
    container.pagination({
      dataSource: this.products,
      pageSize: this.elementsPerPage,
      className: 'paginationjs-theme-yellow paginationjs-big',
      callback: (data, pagination) => {
        // template method of yourself
        var html = this.template(data);
        $('#data-container').html(html);
        $(".default-img, .product-name").on('click', (e) => {

          e.preventDefault();
          console.log($(e.target).attr('image_id'));
          this.router.navigate(['products'], { queryParams: { 'image_id': $(e.target).attr('image_id') } })
        });
      }
    })

    console.log('Done pagination...')

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

  private readURL() {

    $('#searchImagePreview').attr('src', this.apiLink + '/query-image/' + this.queryImageFileName);
    $('#searchImagePreview').hide();
    $('#searchImagePreview').fadeIn(650);

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
