import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchModalService {

  private searchByImage = new BehaviorSubject<any>(null);

  constructor() {}

    addData(data: any) {
        this.searchByImage.next(data);
    }

    getData(): Observable<any> {
        return this.searchByImage.asObservable().pipe(filter(x => x !== null));;
    }
}
