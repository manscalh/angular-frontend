import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router, Route } from '@angular/router';


@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

constructor(private router: Router) {}

intercept(request: HttpRequest<any>, next: HttpHandler): any {
 return next.handle(request).pipe(catchError(error => {
    return this.handle401Error(request, next);
 }));
}

private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.handleToken(request, next);
}

private handleToken(responserequest: HttpRequest<any>, next: HttpHandler) {
     localStorage.clear();
     this.router.navigate(['/login']);
     return throwError('Token Expired');
}
}