import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor(private httpClient: HttpClient) { }

  public chartsAnnual(chartname: string): Observable<any> {
    
    let baseUrl = "http://localhost:8082/";
 
    return this.httpClient
      .get<any>(baseUrl+`Charts/Get/${chartname}`)
      .pipe(
        tap((res) => {
          return res;
        }, (err) => {
          console.log(err.error)
          if (err.status === 401) {
            
          }
          return err;
        }),
      );
  }

}
