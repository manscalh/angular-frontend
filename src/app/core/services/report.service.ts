import { Injectable } from "@angular/core";
import { IReport } from "../models";
import { IReportAll } from "../models";
import { BehaviorSubject, Observable, Subject  } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { delay, tap } from "rxjs/operators";
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
  })
export class ReportService{
    private currentSubject = new BehaviorSubject<IReport>({});
  
    // private URL_API = environment.baseUrlBackend+"/report";
    private URL_API = environment.baseUrlBackend+"/completecycles";
    private URL_API_ALL = environment.baseUrlBackend+"/allhistory";
    //private URL_API = "http://localhost:3000/completecycles";
    //private URL_API_ALL = "http://localhost:3000/allhistory";
    private dadosFiltrados: any;
    private dadosFiltradosSubject: Subject<any> = new Subject<any>();
    private dadosReport: any;
    private dadosReportSubject: Subject<any> = new Subject<any>();
    private dadosReportAll: any;
    private dadosReportAllSubject: Subject<any> = new Subject<any>();
  
    constructor(private httpClient: HttpClient, private router: Router, private authservice: AuthService) { }
  
    set(Report: IReport): void {
      this.currentSubject.next(Report);
    }

    public get getHeader():any{
      const headers = { 'Authorization': 'Bearer '+this.authservice.getUser.token }
      return headers;
    }

    setDadosFiltrados(dados: any) {
      this.dadosFiltradosSubject.next(dados);
    }
  
    getDadosFiltrados() {
      return this.dadosFiltrados;
    }
  
    getDadosFiltradosObservable() {
      return this.dadosFiltradosSubject.asObservable();
    }

    setDadosReport(dados: any) {
      this.dadosReportSubject.next(dados);
    }

    getDadosReport() {
      return this.dadosReport;
    }

    getDadosReportObservable() {
      return this.dadosReportSubject.asObservable();
    }

    setDadosReportAll(dados: any) {
      this.dadosReportAllSubject.next(dados);
    }

    getDadosReportAll() {
      return this.dadosReportAll;
    }

    getDadosReportAllObservable() {
      return this.dadosReportAllSubject.asObservable();
    }
  
    public getAll(): Observable<any> {
  
        return this.httpClient
          .post<any>(this.URL_API, '', { headers: this.getHeader })
          .pipe(
            delay(3000),
            tap((res) => {
    
              return res;
    
            }, (err) => {
              console.log(err.error)
              if (err.status === 401) {
                // this.authErrors.next({ invalidEmailOrPassword: true });
              }
              return err;
            }),
          );
    }

    public getAllHistory(): Observable<any> {
  
      return this.httpClient
        .post<any>(this.URL_API_ALL, '', { headers: this.getHeader })
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

    public getAllByFilter(filter: []): Observable<any> {
  
      return this.httpClient
        .post<any>(this.URL_API, filter, { headers: this.getHeader })
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

  public getAllHistoryByFilter(filter: []): Observable<any> {
  
    return this.httpClient
      .post<any>(this.URL_API_ALL, filter, { headers: this.getHeader })
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