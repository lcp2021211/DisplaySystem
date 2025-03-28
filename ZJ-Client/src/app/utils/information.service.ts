import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverIP } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InformationService {
  constructor(private http: HttpClient) {}

  /**
   * Get all spies
   * @returns {Observable<any>}
   * @memberof InformationService
   */
  getSpyInfo(): Observable<any> {
    return this.http.get(`${serverIP}/getSpyInfo`);
  }

  /**
   * Get the percentage of spies
   * @returns {Observable<any>}
   * @memberof InformationService
   */
  getSpyPercent(): Observable<any> {
    return this.http.get(`${serverIP}/getSpyPercent`);
  }

  /**
   * Get the information of network topology
   * @returns {Observable<any>}
   * @memberof InformationService
   */
  getTopologyInfo(): Observable<any> {
    return this.http.get(`${serverIP}/getClientNetworkInfo`);
  }

   /**
   * Get the information of Attack
   * @returns {Observable<any>}
   * @memberof InformationService
   */
  getAttackInfo(): Observable<any> {
    return this.http.get(`${serverIP}/getAttackInfo`);
  }

}
