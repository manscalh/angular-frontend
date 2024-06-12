import { Injectable } from "@angular/core";
import {
    HttpInterceptor, HttpHandler, HttpRequest,
} from '@angular/common/http';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private router: Router,private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        let accessToken: string = localStorage.getItem("token") || "";
        if (accessToken && accessToken.length>0 ){
            let tokenExpiration: any = new Date(localStorage.getItem("tokenExpiration") || "");
            if( tokenExpiration > new Date()) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }
            else {
                console.log('Token Expired... Token Referesh')
                this.authService.logout();
            }
        }else{
            request = request.clone({
                setHeaders: {
                    Authorization: ""
                }
            });
        }
        return next.handle(request);
    }
}