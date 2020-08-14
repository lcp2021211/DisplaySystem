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
      title: '客户端',
      icon: 'person-outline',
      link: '/client',
      home: true
    },
    { 
      title: '代理节点',
      icon: 'activity-outline',
      link: '/proxy'
    },
    { 
      title: '内容服务器',
      icon: 'hard-drive-outline',
      link: '/server'
    },
    {
      title: '其它信息',
      icon: 'pie-chart-outline',
      link: '/information'
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
