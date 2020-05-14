import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiLinkService } from './api-link.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
 
  constructor(
    private http: HttpClient,
    private apiLink: ApiLinkService
  ) { }


  public fetchHomePageValues(){
    console.log(this.apiLink.homeAPIURL)
    return this.http.get(this.apiLink.homeAPIURL);

  }

  public fetchRecommendations(queryImageId: any) {
  
    let data = new FormData();
    data.set('image_id', queryImageId);
    
    return this.http.post(this.apiLink.searchAPIURL, data);
  }

  public searchForProduct(data: FormData) {
    
    
    return this.http.post(this.apiLink.searchProductAPIURL, data);
    
  }

}
