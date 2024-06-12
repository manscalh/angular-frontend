import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConfigRootService } from 'src/app/core/services/config-root.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  constructor(private configRootService: ConfigRootService, private router: Router, private authservice: AuthService) { }

  public get getMenus(): any {
    var obj = this.authservice.getUser.menuHome || [];
    var menu = obj.filter(a => a.showHome);
    return menu;
  }

  ngOnInit(): void {
  }

  navigate(url:string){
    // this.router.navigateByUrl('/', { replaceUrl: true, skipLocationChange: true }).then(() => {this.router.navigate([url])});
    // this.router.navigate([url], { skipLocationChange: true, replaceUrl: true });
    // this.router.navigate([url]).then(() => {window.location.reload();});
    // window.location.href = url;
  }

}
