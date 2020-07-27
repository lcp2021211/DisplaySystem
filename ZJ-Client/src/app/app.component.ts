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
      title: 'Client',
      icon: 'person-outline',
      link: '/client',
      home: true
    },
    {
      title: 'Information',
      icon: 'pie-chart-outline',
      link: '/information'
    }, 
    { 
      title: 'Proxy',
      icon: 'activity-outline',
      link: 'proxy'
    },
    { 
      title: 'Server',
      icon: 'hard-drive-outline',
      link: 'server'
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
