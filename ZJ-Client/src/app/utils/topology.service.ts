import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverIP } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopologyService {
  constructor(private http: HttpClient) {}

  /**
   * Get the information of network topology
   * @returns {Observable<any>}
   * @memberof TopologyService
   */
  getTopologyInfo(): Observable<any> {
    return this.http.get(`${serverIP}/users/getClientNetworkInfo`);
  }
}
