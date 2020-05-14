import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiLinkService } from '../api-link.service';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';
import * as baseLocation from '../../config/base_location.json';
declare var $: any;
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private apiLinks: ApiLinkService,
    private apiService: ApiService
  ) { }

  queryImageId: any;
  queryImageDetails: any;

  recommendedImages: any;

  busy: Subscription;
  apiLink: string = baseLocation.base_backoffice;
  p: any;

  ngOnInit() {
    this.p = 1;
    this.recommendedImages = [];
    this.queryImageDetails = null;

    this.route.queryParams.subscribe(
      (params: any) => {
        console.log(params)
        this.queryImageId = params['image_id'];
        this.searchSimilarProduct();
      }
    )
  }

  searchForThisItem(image_id){
    this.p = 1;
    this.queryImageId = image_id;
    this.searchSimilarProduct();
  }

  searchSimilarProduct() {

    this.busy = this.apiService.fetchRecommendations(this.queryImageId).subscribe(
      (data: any) => {

        if (data.success) {

          // let all_images = data.data;
          this.queryImageDetails = data.query_image;

          // let meta = data.meta;
          // let cur_image, cur_meta;

          this.recommendedImages = data.data;

          // for (let i = 1, n = all_images.length; i < n; i++) {
          //   cur_image = all_images[i]
          //   cur_meta = meta.find((a) => a.image_id == cur_image.image_id)

          //   if (cur_meta) {

          //     cur_image.article_type = cur_meta.article_type;
          //     cur_image.product_display_name = cur_meta.product_display_name;
          //     this.recommendedImages.push(JSON.parse(JSON.stringify(cur_image)))

          //   }

          // }

          this.recommendedImages = this.recommendedImages.slice(0, 100)

        } else {

          alert('Something wrong!');

        }

      },
      (error) => {
        console.log(error);
      },
      () => {
        this.busy.unsubscribe();
      }
    )
  }


  showDetails(type, event) {

    if (type == 'in') {

      $(event.target.parentElement).next().addClass('card-show')

    } else {

      $(event.target.parentElement).next().removeClass('card-show')

    }

  }

}
