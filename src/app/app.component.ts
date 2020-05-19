import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as baseLocation from '../config/base_location.json';
import { ApiService } from './api.service';
import { HomeDataService } from './home-data.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'UI';
  
  constructor(
    private apiService: ApiService,
    private homeService: HomeDataService
  ) { }
  
  busy: Subscription;
  apiLink: string = baseLocation.base_backoffice;

   

  ngOnInit() { 

    this.busy = this.apiService.fetchHomePageValues().subscribe(
      (data: any) => {
        try {

          if (data.success) {

            this.homeService.addData(data.data);

          } else {

            alert(data.message)

          }

        } catch (e) {

          console.log(e)
        }

      },
      (error) => {
        console.log('Error')
        console.log(error)
      },
      () => {
        this.busy.unsubscribe();

      }
    )
    
     
  }
   
}
