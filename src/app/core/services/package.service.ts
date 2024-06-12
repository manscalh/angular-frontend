import { Injectable } from "@angular/core";
import { IPackage } from "../models";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { delay, tap } from "rxjs/operators";
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
  })
export class PackageService{
    private currentSubject = new BehaviorSubject<IPackage>({});
  
    private URL_API = environment.baseUrlBackend+"/package";
    //private URL_API = "http://localhost:3000/package";

    constructor(private httpClient: HttpClient, private router: Router, private authservice: AuthService) { }
  
    set(Package: IPackage): void {
      this.currentSubject.next(Package);
    }

    public get getHeader():any{
      const headers = { 'Authorization': 'Bearer '+this.authservice.getUser.token }
      return headers;
    }
  
    public save(obj: IPackage): Observable<any> {
  
      return this.httpClient
        .post<any>(this.URL_API, obj, { headers: this.getHeader })
        .pipe(
          delay(3000),
          tap((res) => {
  
            return res;
  
          }, (err) => {
            console.log(err.error)
            if (err.status === 401) {
              //this.authErrors.next({ invalidEmailOrPassword: true });
            }
            return err;
          }),
        );
    }

    public edit(obj: IPackage): Observable<any> {
  
      return this.httpClient
        .put<any>(this.URL_API+"/"+obj.id, obj, { headers: this.getHeader })
        .pipe(
          delay(3000),
          tap((res) => {
  
            return res;
  
          }, (err) => {
            console.log(err.error)
            if (err.status === 401) {
              //this.authErrors.next({ invalidEmailOrPassword: true });
            }
            return err;
          }),
        );
    }

    public delete(id: number): Observable<any> {
  
      return this.httpClient
        .delete<any>(this.URL_API+"/"+id, { headers: this.getHeader })
        .pipe(
          delay(3000),
          tap((res) => {
  
            return res;
  
          }, (err) => {
            console.log(err.error)
            if (err.status === 401) {
              //this.authErrors.next({ invalidEmailOrPassword: true });
            }
            return err;
          }),
        );
    }

    public getAll(): Observable<any> {
  
        return this.httpClient
          .get<any>(this.URL_API, { headers: this.getHeader })
          .pipe(
            delay(3000),
            tap((res) => {
    
              return res;
    
            }, (err) => {
              console.log(err.error)
              if (err.status === 401) {
                //this.authErrors.next({ invalidEmailOrPassword: true });
              }
              return err;
            }),
          );
    }

    public getAllByFilter(filter: string): Observable<any> {
  
      return this.httpClient
        .get<any>(this.URL_API+"/filter/"+filter+"", { headers: this.getHeader })
        .pipe(
          delay(3000),
          tap((res) => {
  
            return res;
  
          }, (err) => {
            console.log(err.error)
            if (err.status === 401) {
              //this.authErrors.next({ invalidEmailOrPassword: true });
            }
            return err;
          }),
        );
  }

    public get(id: Number): Observable<any> {
  
        return this.httpClient
          .get<any>(this.URL_API+"/"+id, { headers: this.getHeader })
          .pipe(
            delay(3000),
            tap((res) => {
    
              return res;
    
            }, (err) => {
              console.log(err.error)
              if (err.status === 401) {
                //this.authErrors.next({ invalidEmailOrPassword: true });
              }
              return err;
            }),
          );
    }
}