import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPrinterScan } from '../models/printerscan-model';

@Injectable({
  providedIn: 'root'
})
export class BoxorlabelTableServiceService {

  private data = new BehaviorSubject<IPrinterScan[]>([]);
  
  setData(data: IPrinterScan[]): void {
    this.data.next(data);
  }

  getData(): Observable<IPrinterScan[]> {
    return this.data.asObservable();
  }

  constructor() { }
}
