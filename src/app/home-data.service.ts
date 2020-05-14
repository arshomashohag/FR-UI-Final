import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class HomeDataService {

  private homeData = new BehaviorSubject<any>(null);
  
  constructor() {
    let prevValues = localStorage.getItem('home_values');
    if (prevValues) {
      this.homeData.next(JSON.parse(prevValues));
    }
  }


  addData(data: any) {
    this.homeData.next(data);
    localStorage.setItem('home_values', JSON.stringify(data));
  }

  getData(): Observable<any> {
    console.log('Service called')
    return this.homeData.asObservable().pipe(filter(x => x !== null));;
  }
}
