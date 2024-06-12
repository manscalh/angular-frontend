import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree} from '@angular/router'
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IMenu } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private authservice: AuthService,  private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const isAuthenticated = this.authservice.canNavigate();

    if(this.authservice.getUser.token != null){
      if (isAuthenticated) {
        return true;   
      }
      else{
        this.router.navigateByUrl('/login');
        return false;
      }
    }
    else{
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
