import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class SnackbarService {
  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom'
  };

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    ) {}

  success(message) {
    this.config.panelClass = ['notification', 'success'];
    this.snackBar.open(message, '', this.config);
  }

  error(message) {
    this.config.panelClass = ['notification', 'error'];
    this.snackBar.open(message, '', this.config);
  }

  messageRouter(message = "ok", type = ['notification', 'success'], url="/"){
    this.config.panelClass = type;
    this.snackBar.open(message, 'fechar', {
        duration: 4000,
        panelClass: type
      }).afterDismissed().subscribe(()=>{
        this.router.navigateByUrl(url);
      });
  }
}
