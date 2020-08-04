import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverIP } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  constructor(private http: HttpClient) {}

  /**
   * Get the information of network topology
   * @returns {Observable<any>}
   * @memberof InformationService
   */
  getTopologyInfo(): Observable<any> {
    return this.http.get(`${serverIP}/getClientNetworkInfo`);
  }
}
