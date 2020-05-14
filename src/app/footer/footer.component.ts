import { Component, OnInit } from '@angular/core';

import * as baseLocation from '../../config/base_location.json';
declare var $:any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }
  apiLink: string = baseLocation.base_backoffice;
  ngOnInit() {
  }

}
