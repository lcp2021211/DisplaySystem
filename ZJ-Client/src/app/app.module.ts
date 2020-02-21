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
  NbToggleModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { InformationComponent } from './pages/information/information.component';
import { TopologyComponent } from './pages/topology/topology.component';
import { VideoCardComponent } from './pages/information/video-card/video-card.component';
import { DownloadCardComponent } from './pages/information/download-card/download-card.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { InformationService } from './utils/information.service';

@NgModule({
  declarations: [
    AppComponent,
    InformationComponent,
    TopologyComponent,
    VideoCardComponent,
    DownloadCardComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NbToastrModule.forRoot(),
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NgxEchartsModule,
    NbProgressBarModule,
    NbSelectModule,
    NbToggleModule,
    HttpClientModule
  ],
  providers: [InformationService],
  bootstrap: [AppComponent]
})
export class AppModule {}
