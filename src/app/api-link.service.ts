import { Injectable } from '@angular/core';

import * as baseLocation from '../config/base_location.json';

@Injectable({
  providedIn: 'root'
})
export class ApiLinkService {
  
  
  constructor() { }

  public homeAPIURL = baseLocation.base_backoffice + '/home';
  public searchAPIURL = baseLocation.base_backoffice + '/search-by-id';
  public searchProductAPIURL = baseLocation.base_backoffice + '/recommend-by-image';
  
}
