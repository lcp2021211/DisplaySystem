import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbProgressBarModule,
  NbSidebarModule,
  NbSelectModule,
  NbMenuModule,
  NbToastrModule,
  NbToggleModule,
  NbListModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { ClientComponent } from './pages/client/client.component';
import { InformationComponent } from './pages/information/information.component';
import { VideoCardComponent } from './pages/client/video-card/video-card.component';
import { DownloadCardComponent } from './pages/client/download-card/download-card.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProxyComponent } from './pages/proxy/proxy.component';
import { ServerComponent } from './pages/server/server.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
   declarations: [
      AppComponent,
      ClientComponent,
      InformationComponent,
      VideoCardComponent,
      DownloadCardComponent,
      NotFoundComponent,
      ProxyComponent,
      ServerComponent,
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      NbToastrModule.forRoot(),
      NbMenuModule.forRoot(),
      NbSidebarModule.forRoot(),
      NbThemeModule.forRoot({ name: 'dark'}),
      NbLayoutModule,
      NbEvaIconsModule,
      NbButtonModule,
      NbCardModule,
      NbIconModule,
      NgxEchartsModule,
      NbProgressBarModule,
      NbSelectModule,
      NbToggleModule,
      HttpClientModule,
      NbListModule,
      Ng2SmartTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
