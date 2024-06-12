import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/event-emitter.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  private subOpenOrCloseSidebar: any;
  openedSidebar: boolean = false;

  constructor(public readonly router: Router) { }

  ngOnInit(): void {

    this.subOpenOrCloseSidebar = EventEmitterService.get('openOrCloseSidebar').subscribe((data) => {
      this.openedSidebar = data
    });

  }

  ngOnDestroy() {
    this.subOpenOrCloseSidebar.unsubscribe();
  }

}
