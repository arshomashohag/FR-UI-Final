import { Component, OnInit, OnDestroy } from '@angular/core';


import * as baseLocation from '../../config/base_location.json';
import { HomeDataService } from '../home-data.service';
import { Subscription } from 'rxjs';
import { MenuFlagService } from '../menu-flag.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { SearchedValueService } from '../searched-value.service';
import { SearchModalService } from '../search-modal.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {
  baseColours: any;
  genders: any;
  masterCategories: any;
  subCategories: any;
  articleTypes: any;
  genderWiseArticles: any;

  gender: any;
  articleType: any;
  subCategory: any;
  color: any;


  menuSubscriber: Subscription;
  modalSubscriber: Subscription;
  menuCategoryFlag: boolean;
  menuActiveItemFlag: any;
  searchedImage: any;
  products: any;
  renderedImage: any;


  constructor(
    private homeService: HomeDataService,
    private menuService: MenuFlagService,
    private apiService: ApiService,
    private router: Router,
    private seachedDataService: SearchedValueService,
    private searchModalService: SearchModalService
  ) { }

  homeSubscriber: Subscription
  apiLink: string = baseLocation.base_backoffice;

  ngOnInit() {
    this.baseColours = [];
    this.genders = [];
    this.masterCategories = [];
    this.subCategories = [];
    this.articleTypes = [];
    this.menuCategoryFlag = false;

    this.homeSubscriber = this.homeService.getData().subscribe(
      (data: any) => {

        if (data.article_type) {
          this.articleTypes = data.article_type
          let articleTypeAutocompleteData = [];

          this.articleTypes.forEach((item, ind) => {
            articleTypeAutocompleteData.push({
              'id': ind,
              'name': item,
              'value': item,
              'ignore': false
            })
          });
          $('#article-type-id').autocomplete({
            nameProperty: 'name',
            valueProperty: 'value',
            valueField: '#article-type-input',
            dataSource: articleTypeAutocompleteData

          });
        }

        if (data.base_colour) {
          this.baseColours = data.base_colour;
          let baseColorAutocompleteData = [];

          this.baseColours.forEach((item, ind) => {
            baseColorAutocompleteData.push({
              'id': ind,
              'name': item,
              'value': item,
              'ignore': false
            })
          });
          $('#base-color-id').autocomplete({
            nameProperty: 'name',
            valueProperty: 'value',
            valueField: '#base-color-input',
            dataSource: baseColorAutocompleteData

          });
        }

        if (data.gender) {
          this.genders = data.gender;
        }

        if (data.master_category) {
          this.masterCategories = data.master_category;
        }

        if (data.sub_category) {
          this.subCategories = data.sub_category;
          let subcatAutocompleteData = [];

          this.subCategories.forEach((item, ind) => {
            subcatAutocompleteData.push({
              'id': ind,
              'name': item,
              'value': item,
              'ignore': false
            })
          });
          $('#sub-cat-id').autocomplete({
            nameProperty: 'name',
            valueProperty: 'value',
            valueField: '#sub-cat-input',
            dataSource: subcatAutocompleteData

          });


        }

        if (data.gender_wise_article) {

          this.genderWiseArticles = data.gender_wise_article;

          if (this.genderWiseArticles.kids) {

            this.genderWiseArticles.kids = this.genderWiseArticles.kids.filter((item, pos) => {

              return this.genderWiseArticles.kids.indexOf(item) == pos;
            })

          }
        }

      },
      (error: any) => {

      },
      () => {
        console.log('Done');
      }
    );

    this.modalSubscriber = this.searchModalService.getData().subscribe(
      (data: any) => {
        console.log('Openning modal!');
        console.log(data)
        if (data) {
          console.log('Modal flag not null');
           
          if (data.modal_flag) {
             
            this.openModal();
            this.searchModalService.addData({ 'modal_flag': false })
          }
        }
      }
    )

    this.menuSubscriber = this.menuService.getData().subscribe(
      (data: any) => {
        this.menuCategoryFlag = data.category;
        this.menuActiveItemFlag = {
          'home': data.home,
          'product': data.product
        }
      }
    );

    $("#imageUpload").change((e) => {
      this.readURL(e.target);
    });


  }

  readURL(input) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.renderedImage = reader.result;
        $('#imagePreview').css('background-image', 'url(' + reader.result + ')');
        $('#imagePreview').hide();
        $('#imagePreview').fadeIn(650);
      }
      reader.readAsDataURL(input.files[0]);
      this.searchedImage = input.files[0];
    }

  }

  openModal() {
    $("#search-bar-id").click();
    // $(".modal-body").niceScroll('.modal-form',{ fixed: true, horizrailenabled:false });

  }

  search(event) {

    event.preventDefault();
    $("#close-search-modal").click();

    let data = new FormData();
    let flag = false;

    // this.subCategory = $('#sub-cat-input').val(); 

    // if (this.subCategory) {
    //   data.set('sub_category', this.subCategory);
    //   flag = true;
    // }

    this.articleType = $('#article-type-input').val();
    if (this.articleType) {
      data.set('article_type', this.articleType)
      flag = true;
    }

    console.log(this.gender);
    if (this.gender) {
      data.set('gender', this.gender);
      flag = true;
    }

    this.color = $('#base-color-input').val();
    if (this.color) {
      data.set('base_colour', this.color);
      flag = true;
    }

    if (this.searchedImage) {

      data.set('file', this.searchedImage);
      flag = true;
    }

    if (!flag) {

      return;
    }

    $('.preloader').fadeIn('slow', function () {
      $(this).show();
    });
    this.apiService.searchForProduct(data).subscribe(
      (data: any) => {
        if (data.success) {

          let prods = data.data;
          this.products = prods.slice(0, 100);

          this.seachedDataService.addData({ 'success': true, 'data': this.products, 'image': data.image_name, });

          if (this.router.url.indexOf('/search-products') <= -1) {

            this.router.navigate(['search-products'], { queryParams: { image_search: 'ok' } });

          }

        } else {
          alert(data.message);
        }
      },
      (error) => {
        alert(error.message)
      },
      () => {
        $('.preloader').fadeOut('slow', function () {
          $(this).hide();
        });
      }
    );


  }



  resetForm() {
    this.searchedImage = null;
    console.log('Reseting image')
    this.gender = "";
    this.articleType = "";
    this.color = "";
    $("#imagePreview").css('background-image', 'url(http://i.pravatar.cc/500?img=7)');
    $('#imagePreview').hide();
    $('#imagePreview').fadeIn(650);
  }

  selectGender(value){

    if(value == this.gender){
      this.gender = "";
      return;
    }

    this.gender = value;
  }

  ngOnDestroy() {

    if (this.menuSubscriber) {
      this.menuSubscriber.unsubscribe();
    }
    if (this.homeSubscriber) {
      this.homeSubscriber.unsubscribe();
    }
    if (this.modalSubscriber) {
      this.modalSubscriber.unsubscribe();
    }

  }

}
