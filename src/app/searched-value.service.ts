import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchedValueService {

  
  private imageSearchData = new BehaviorSubject<any>(null);
  constructor() { 
    let prevValues = localStorage.getItem('search_recommendation');
    if(prevValues){
       this.imageSearchData.next(JSON.parse(prevValues));
    }
  }

    addData(data: any) {
        this.imageSearchData.next(data);
        localStorage.setItem('search_recommendation', JSON.stringify(data));
    }

    getData(): Observable<any> {
        return this.imageSearchData.asObservable().pipe(filter(x => x !== null));;
    }
}
