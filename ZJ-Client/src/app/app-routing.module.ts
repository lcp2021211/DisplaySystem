import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './pages/client/client.component';
import { InformationComponent } from './pages/information/information.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProxyComponent } from './pages/proxy/proxy.component';
import { ServerComponent } from './pages/server/server.component';

const routes: Routes = [
  { path: 'client', component: ClientComponent },
  { path: 'information', component: InformationComponent },
  { path: 'proxy', component: ProxyComponent },
  { path: 'server', component: ServerComponent },
  { path: '', redirectTo: 'client', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
