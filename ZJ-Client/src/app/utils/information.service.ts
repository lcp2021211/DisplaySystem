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

    /**
   * Initialize array of speed and delay
   * @param {any[]} attackFrequency
   * @param {any[]} attackStrength
   * @memberof InformationService
   */
  initializeChartData(attackFrequency: any[], attackStrength: any[]) {
    const DATA_LENGTH = 50;
    let now = new Date();
    now = new Date(now.getTime() - DATA_LENGTH * 1000);
    for (let i = 0; i < DATA_LENGTH; ++i) {
      // Push zero into array
      attackFrequency.push({
        name: now,
        value: [now, 0]
      });
      attackStrength.push({
        name: now,
        value: [now, 0]
      });
      now = new Date(now.getTime() + 1000);
    }
  }
}
