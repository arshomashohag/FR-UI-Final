import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuFlagService {

  constructor() { }
  private menuFlags = new BehaviorSubject<any>(null);

    addData(flag: any) {
        this.menuFlags.next(flag);
    }

    getData(): Observable<any> {
        return this.menuFlags.asObservable().pipe(filter( x => x!== null ));
    }
}
