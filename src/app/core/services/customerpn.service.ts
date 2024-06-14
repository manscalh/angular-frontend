import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { delay, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { ICustomerPN } from "../models/customerpn.model";

@Injectable({
  providedIn: "root",
})
export class CustomerPNService {
  private currentSubject = new BehaviorSubject<ICustomerPN>({});

  private URL_API = environment.baseUrlBackend + "/customerpn";

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) {}

  set(Hardware: ICustomerPN): void {
    this.currentSubject.next(Hardware);
  }

  public get getHeader(): any {
    const headers = {
      Authorization: "Bearer " + this.authservice.getUser.token,
    };
    return headers;
  }

  public save(obj: ICustomerPN): Observable<any> {
    return this.httpClient
      .post<any>(this.URL_API, obj, { headers: this.getHeader })
      .pipe(
        delay(500),
        tap(
          (res) => {
            return res;
          },
          (err) => {
            if (err.error.statusCode === 403) {
              this.authservice.redirectTo("/unauthorized");
            }
            return err;
          }
        )
      );
  }

  public edit(obj: ICustomerPN): Observable<any> {
    return this.httpClient
      .patch<any>(this.URL_API + "/" + obj.id, obj, { headers: this.getHeader })
      .pipe(
        delay(500),
        tap(
          (res) => {
            return res;
          },
          (err) => {
            if (err.error.statusCode === 403) {
              this.authservice.redirectTo("/unauthorized");
            }
            return err;
          }
        )
      );
  }

  public delete(id: number): Observable<any> {
    return this.httpClient
      .delete<any>(this.URL_API + "/" + id, { headers: this.getHeader })
      .pipe(
        delay(500),
        tap(
          (res) => {
            return res;
          },
          (err) => {
            if (err.error.statusCode === 403) {
              this.authservice.redirectTo("/unauthorized");
            }
            return err;
          }
        )
      );
  }

  public getAll(page: number = 1, perPage: number = 5): Observable<any> {
    return this.httpClient
      .get<any>(this.URL_API + "?page=" + page + "&perPage=" + perPage, {
        headers: this.getHeader,
      })
      .pipe(
        delay(500),
        tap(
          (res) => {
            console.log("Daniel", res);

            return res;
          },
          (err) => {
            if (err.error.statusCode === 403) {
              this.authservice.redirectTo("/unauthorized");
            }
            return err;
          }
        )
      );
  }

  public getAllByFilter(
    filter: string,
    page: number = 1,
    perPage: number = 5
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.URL_API +
          "?filter=" +
          filter +
          "&page=" +
          page +
          "&perPage=" +
          perPage,
        { headers: this.getHeader }
      )
      .pipe(
        delay(500),
        tap(
          (res) => {
            return res;
          },
          (err) => {
            if (err.error.statusCode === 403) {
              this.authservice.redirectTo("/unauthorized");
            }
            return err;
          }
        )
      );
  }

  public getAllByCompanyByFilter(
    idCompany: number,
    filter: string,
    page: number = 1,
    perPage: number = 5
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.URL_API +
          "/company/" +
          idCompany +
          "?filter=" +
          filter +
          "&page=" +
          page +
          "&perPage=" +
          perPage,
        { headers: this.getHeader }
      )
      .pipe(
        delay(500),
        tap(
          (res) => {
            return res;
          },
          (err) => {
            if (err.error.statusCode === 403) {
              this.authservice.redirectTo("/unauthorized");
            }
            return err;
          }
        )
      );
  }

  public get(id: Number): Observable<any> {
    return this.httpClient
      .get<any>(this.URL_API + "/" + id, { headers: this.getHeader })
      .pipe(
        delay(500),
        tap(
          (res) => {
            return res;
          },
          (err) => {
            if (err.error.statusCode === 403) {
              this.authservice.redirectTo("/unauthorized");
            }
            return err;
          }
        )
      );
  }
}
