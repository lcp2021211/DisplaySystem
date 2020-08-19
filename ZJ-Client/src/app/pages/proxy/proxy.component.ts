import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ProxyService } from 'src/app/utils/proxy.service';
import { sec } from 'src/app/utils/global';
import { HttpErrorResponse } from '@angular/common/http';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.css'],
})
export class ProxyComponent implements OnInit, AfterViewInit, OnDestroy {
  private timer: any;

  config: any;
  selected: string = 'cpu';
  proxies: any;
  info: any;

  constructor(private service: ProxyService, private theme: NbThemeService) {}

  ngOnInit() {}

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  ngAfterViewInit() {
    this.theme.getJsTheme().subscribe((config) => {
      this.config = config;
    });

    this.timer = setInterval(async () => {
      await this.service
        .getProxyInfo()
        .then((res: any) => {
          if (res.code === 200) {
            this.info = res.data;
            if (this.proxies === undefined) {
              this.proxies = Object.keys(this.info);
            }
          }
        })
        .catch((err: HttpErrorResponse) => {
          console.error(err);
        });
    }, sec);
  }
}
