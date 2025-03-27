import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { serverIP } from './global';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private http: HttpClient) {}

  /**
   * @param {{}} data
   * @memberof ServerService
   */
  initializeChartData(data: {}) {
    const DATA_LENGTH = 50;
    let now = new Date();
    now = new Date(now.getTime() - DATA_LENGTH * 1000);
    data['cpuSpeed'] = [];
    data['cpuLoad'] = [];
    data['memUsed'] = [];
    data['memActive'] = [];
    data['memFree'] = [];
    data['fsRX'] = [];
    data['fsWX'] = [];
    data['fsTX'] = [];
    data['netRX'] = [];
    data['netTX'] = [];
    for (let i = 0; i < DATA_LENGTH; ++i) {
      for (let key in data) {
        data[key].push({
          name: now,
          value: [now, 0],
        });
      }
      now = new Date(now.getTime() + 1000);
    }
  }

  /**
   * @returns {Promise<any>}
   * @memberof ServerService
   */
  getServerInfo(): Promise<any> {
    return this.http.get(`${serverIP}/getServerInfo`).toPromise();
  }
}
