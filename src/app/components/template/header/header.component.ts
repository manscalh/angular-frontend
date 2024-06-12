import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConfigRootService } from 'src/app/core/services/config-root.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private subOpenOrCloseSidebar: any;
  openedSidebar: boolean = false;
  public selectedIndex: number = 0;

  constructor(private configRootService: ConfigRootService, public authservice: AuthService) { }

  ngOnInit(): void {
    this.subOpenOrCloseSidebar = this.configRootService.getOpenside().subscribe(data => {
      this.openedSidebar = data;
    });

  }

  openOrCloseSidebar() {
    this.openedSidebar = !this.openedSidebar
    this.configRootService.setOpenside(this.openedSidebar);
  }

  ngOnDestroy() {
    this.subOpenOrCloseSidebar.unsubscribe();
  }

  onMouseEnter(index: number) {
    this.selectedIndex = index
  }

  onMouseLeave() {
    this.selectedIndex = 0;
  }

  logout(){
    this.authservice.logout()
  }
}
