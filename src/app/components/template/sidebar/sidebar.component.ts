import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigRootService } from 'src/app/core/services/config-root.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenu } from 'src/app/core/models';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private subOpenOrCloseSidebar: any;
  openedSidebar: boolean = true;
  clickedIndex: number = 0;
  clickedIndexJ: number = -1;
  isManagementSubMenuOpen = false;

  constructor(private configRootService: ConfigRootService, private router:Router, private authservice: AuthService) { 
  
  }

  public get getMenus(): Array<IMenu> {
    var obj = this.authservice.getMenu || [];
    var menu = obj.filter(a => a.showSideBar);

    for (let i = 0; i < menu.length; i++) {
      const element = this.getMenuSubMenu(menu[i].subitens || []);
      menu[i].subitens = element;
    }
    
    return menu;
  }

  public getMenuSubMenu(sub: Array<IMenu>): Array<IMenu> {
    var menu = sub.filter(a => a.showSideBar);

    for (let i = 0; i < menu.length; i++) {
      const element = this.getMenuSubMenu(menu[i].subitens || []);
      menu[i].subitens = element;
    }
    
    return menu;
  }

  ngOnInit(): void {

    this.subOpenOrCloseSidebar = this.configRootService.getOpenside().subscribe(data => {
      this.openedSidebar = data;
    });

    let menuHome = this.authservice.getUser.menuHome || [];

    this.router.events.subscribe(e => {
      if(e instanceof NavigationEnd){

        var achou_url = false;
        var url_ = e.url.split("/");
        var url_check = "";

        for (let index = 0; index < url_.length; index++) {
          const element = url_[index];
          if(element.length > 0 && index <= 3)
            url_check = url_check+"/"+element;
        }

        let data = menuHome.filter(data =>  data.url == url_check);

        if (data.length > 0) {
          achou_url = true;
          this.checkClassActiveURL(url_check);
        }
        
        // if (e.url.trim() != '/unauthorized'){
        //   console.log("url_check",url_check, achou_url, Date.now())
        //   if (achou_url == false) {
        //     if(this.authservice.getUser.groupAccess != 'Administrador'){
        //       this.router.navigateByUrl('/unauthorized');
        //     }
        //   }
        // }
      }
    });

  }

  ngOnDestroy() {
    this.subOpenOrCloseSidebar.unsubscribe();
  }

  showSideBar(){
    this.openedSidebar = !this.openedSidebar
    this.configRootService.setOpenside(this.openedSidebar);
  }

  clickMenu(){
    this.showSideBar();
  }

  checkClassActiveURL(url: string){
    var menu = this.authservice.getMenu || Array<IMenu>();
    for (let index = 0; index < menu.length; index++) {
      const eli = menu[index];
      if (eli.url == url) {
        menu[index].classActive = 'active';
      }
      else
      {
        menu[index].classActive = 'no-active';
      }
      menu[index].subitens = this.findMenuURL(menu[index].subitens || [], url);

    }
    this.authservice.setMenuData(menu);
  }

  findMenuURL(sub: Array<IMenu>, url: string): Array<IMenu>{
    for (let index = 0; index < sub.length; index++) {
      const eli = sub[index];
      if (eli.url == url) {
        sub[index].classActive = 'active';
      }
      else
      {
        sub[index].classActive = 'no-active';
      }
    }
    return sub;
  }
}
