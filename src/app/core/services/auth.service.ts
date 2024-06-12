import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { delay, filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IMenu, IUser } from '../models';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<IUser>({});
  private currentMenuSubject = new BehaviorSubject<Array<IMenu>>([]);
  private URL_API = environment.baseUrlBackend+"/auth/login";
  
  constructor(private httpClient: HttpClient, private router: Router, private snackbarService: SnackbarService) { }

  setUser(user: IUser): void {
    this.currentUserSubject.next(user);
  }

  setMenu(menu: Array<IMenu>): void {
    this.currentMenuSubject.next(menu);
  }

  public get getUser(): IUser {
    const user = localStorage.getItem('currentuser') as string;
    if(user != null) this.setUser(JSON.parse(user));
    
    return this.currentUserSubject.value;
  }

  public get getMenu(): Array<IMenu> {
    const menu = localStorage.getItem('currentmenu') as string;
   
    if(menu != null) this.setMenu(JSON.parse(menu));
    return this.currentMenuSubject.value;
  }

  public signin(email: string, password: string): Observable<any> {

    return this.httpClient
      .post<any>(this.URL_API, { email, password })
      .pipe(
        delay(3000),
        tap((res) => {
          return res;
        }, (err) => {
          return err;
        }),
      );
  }

  public changePassword(id: string, token: string, obj: any): Observable<any> {

    return this.httpClient
      .patch<any>(this.URL_API+"/change-pass/"+id, obj, { headers: { 'Authorization': 'Bearer '+token } })
      .pipe(
        delay(300),
        tap((res) => {
          return res;
        }, (err) => {
          return err;
        }),
      );
  }

  public createSession(res: any){
    this.setUserData({
      token: res.accessToken,
      id: res['user']['id'],
      name: res['user']['name'],
      username: res['user']['user'],
      email: res['user']['email'],
      companyId: res['user']['companyId'],
      groupAccess: res['user']['profile']['name'],
      menu: res.menu,
      menuHome: res.menuHome,
      allowAdd: res['user']['profile']['allowAdd'],
      allowSave: res['user']['profile']['allowSave'],
      allowEdit: res['user']['profile']['allowEdit'],
      allowDelete: res['user']['profile']['allowDelete'],
      allowView: res['user']['profile']['allowView']
    });

    this.setMenuData(res.menu as Array<IMenu>);
  }

  public logout() {
    localStorage.removeItem('currentuser');
    localStorage.removeItem('currentmenu');
    this.currentUserSubject = new BehaviorSubject<IUser>({});
    this.currentMenuSubject = new BehaviorSubject<Array<IMenu>>([]);
    this.router.navigateByUrl('/login');
  }
  
  public canNavigate() {

    var token = this.getUser.token || "";
    if(token.length == 0){
      return false;
    }
    
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    var retorno = (Math.floor((new Date).getTime() / 1000)) >= expiry;

    if (retorno) {
      return false;
    } else {
      return true;
    }
  }

  public checkActionLogout() {

    var token = this.getUser.token || "";
    if(token.length == 0){
      this.logout();
    }
    
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    var retorno = (Math.floor((new Date).getTime() / 1000)) >= expiry;

    if (retorno) {
      this.logout();
    }
  }

  public canAdd(){
    return this.getUser.allowAdd;
  }

  public canSave(){
    return this.getUser.allowSave;
  }

  public canEdit(){
    return this.getUser.allowEdit;
  }

  public canDelete(){
    return this.getUser.allowDelete;
  }

  public canView(){
    return this.getUser.allowView;
  }

  public getToken(){
    var token = this.getUser.token || "";
    
    if(token.length == 0){
      this.logout();
    }
    
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    var retorno = (Math.floor((new Date).getTime() / 1000)) >= expiry;

    if (retorno) {
      this.logout();
    }

    return token;
  }

  private setUserData(currentUser: IUser) {
    localStorage.setItem('currentuser', JSON.stringify(currentUser));
  }

  public setMenuData(currentMenu: Array<IMenu>) {
    localStorage.setItem('currentmenu', JSON.stringify(currentMenu));
  }

  public redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {this.router.navigate([uri])});
  }
}
