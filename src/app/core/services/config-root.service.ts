import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigRootService {

  private opensidebar = new BehaviorSubject<boolean>(false);

  constructor() { }

  setOpenside(opensidebar: boolean): void {
    this.opensidebar.next(opensidebar);
  }

  getOpenside(): Observable<boolean> {
    return this.opensidebar.asObservable();
  }
}
