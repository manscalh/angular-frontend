import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMenu } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor(private router:Router, private authservice: AuthService) { }

  ngOnInit(): void {
  }

  handlerBack(){
    let menu = this.authservice.getMenu || [];

    var url = this.getUrlClassActice(menu);
    this.router.navigateByUrl(url);
  }
  
  getUrlClassActice(array: Array<IMenu>){
    var url = "";
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      var classActive = element.classActive || "";
      if (classActive == "active") {
        url = element.url || "";
        break;
      }
      else{
        url = this.getUrlClassActice(element.subitens || []);
      }
    }
    return url;
  }

}
