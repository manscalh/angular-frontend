import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { IMenu } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  title = 'circularidade-frontend-web';

  constructor( public readonly router: Router, private authservice: AuthService){
    // this.router.events.subscribe(value => {
    //   if(value instanceof NavigationEnd){
    //     console.log('current route: ', this.router.url.toString(), Date.now());
    //   }
      
    // });
   
    this.router.events.subscribe(e => {
      if(e instanceof NavigationEnd){

        if (
           e.url.trim() != '/unauthorized' 
        && e.url.trim() != '/login'
        )
        {
          let menuHome = this.authservice.getUser.menuHome || [];
          var achou_url = false;
          var url_ = e.url.trim().split("/");
          var url_check = "";

          // console.log(e.url, menuHome)

          for (let index = 0; index < url_.length; index++) {
            const element = url_[index];
            if(element.length > 0 && index <= 3)
              url_check = url_check+"/"+element;
          }

          let data = menuHome.filter(data =>  data.url == url_check);

          if (data.length > 0) {
            achou_url = true;
            // this.checkClassActiveURL(url_check);
          }

          // console.log("url_check",url_check, achou_url, Date.now())
          if (achou_url == false) {
            if(this.authservice.getUser.groupAccess != 'Administrador'){
              this.router.navigateByUrl('/unauthorized');
            }
          }

        }
      }
    });
  }

  ngOnInit(): void { }

  // checkClassActiveURL(url: string){
  //   var menu = this.authservice.getMenu || Array<IMenu>();

  //   for (let index = 0; index < menu.length; index++) {
  //     const eli = menu[index];
  //     if (eli.url == url) {
  //       menu[index].classActive = 'active';
  //     }
  //     else
  //     {
  //       menu[index].classActive = 'no-active';
  //     }

  //     menu[index].subitens = this.findMenuURL(menu[index].subitens || [], url);
  //   }

  //   this.authservice.setMenuData(menu);
  // }

  // findMenuURL(sub: Array<IMenu>, url: string): Array<IMenu>{
  //   for (let index = 0; index < sub.length; index++) {
  //     const eli = sub[index];
  //     if (eli.url == url) {
  //       sub[index].classActive = 'active';
  //     }
  //     else
  //     {
  //       sub[index].classActive = 'no-active';
  //     }
  //   }
  //   return sub;
  // }

}
