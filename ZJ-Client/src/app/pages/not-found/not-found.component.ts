import { NbMenuService } from '@nebular/theme';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit, AfterViewInit {
  constructor(private menuService: NbMenuService) {}

  goHome() {
    this.menuService.navigateHome();
  }

  ngOnInit() {}

  ngAfterViewInit() {}
}
