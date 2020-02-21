import { Component, OnInit, OnChanges } from '@angular/core';
import { NbThemeService, NbSidebarService, NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  menus: NbMenuItem[] = [
    {
      title: 'Information',
      icon: 'person-outline',
      link: '/information',
      home: true
    },
    {
      title: 'Topology',
      icon: 'activity-outline',
      link: '/topology'
    }
  ];

  constructor(private themeService: NbThemeService, private sidebarService: NbSidebarService) {}

  ngOnInit() {}

  changeTheme(theme: string) {
    this.themeService.changeTheme(theme);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }
}
