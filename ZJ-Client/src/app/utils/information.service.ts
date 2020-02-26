import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverIP } from './global';

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  constructor(private http: HttpClient) {}

  /**
   * Distribute clientID and proxy 
   * @returns {Observable<any>}
   * @memberof InformationService
   */
  distributeClient(): Observable<any> {
    return this.http.get(`${serverIP}/distributeClient`, {});
  }

  /**
   * Redistribute proxy
   * @returns {Observable<any>}
   * @memberof InformationService
   */
  redistributeClient(clientID: number, proxy: string): Observable<any> {
    return this.http.post(`${serverIP}/redistributeClient`, {
      clientID: clientID,
      proxy: proxy
    });
  }

  /**
   * TODO ()
   * Delete the client from server according to clientID
   * @param {number} clientID
   * @memberof InformationService
   */
  deleteClient(clientID: number) {
    this.http
      .post(`${serverIP}/deleteClient`, { clientID: clientID })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.error(err);
        }
      );
  }

  /**
   * Get the length of video
   * @param {string} url
   * @returns {Promise<any>}
   * @memberof InformationService
   */
  getVideoLength(url: string): Promise<any> {
    return this.http
      .get(`http://${url}/getVideoByRange`, {
        responseType: 'json'
      })
      .toPromise();
  }

  /**
   * Get bytes of video by range(start, end)
   * @param {string} url
   * @param {number} start
   * @param {number} end
   * @returns {Promise<BufferSource>}
   * @memberof InformationService
   */
  getVideoByRange(
    url: string,
    start: number,
    end: number
  ): Promise<BufferSource> {
    return this.http
      .get(`http://${url}/getVideoByRange`, {
        params: { range: `${start}-${end}` },
        responseType: 'arraybuffer'
      })
      .toPromise();
  }

  /**
   * Get whether block
   * @param {number} clientID
   * @returns {Observable<any>}
   * @memberof InformationService
   */
  getBlock(clientID: number): Observable<any> {
    return this.http.post(`${serverIP}/whetherBlock`, {
      clientID: clientID
    });
  }

  /**
   * Post current speed and delay to server
   * @param {number} clientID
   * @param {string} proxy
   * @param {number} speed
   * @param {number} delay
   * @memberof InformationService
   */
  postInformation(
    clientID: number,
    proxy: string,
    speed: number,
    delay: number
  ) {
    this.http
      .post(`${serverIP}/users/setClientNetworkInfo`, {
        clientID: clientID,
        proxy: proxy,
        delayTime: delay,
        networkSpeed: speed
      })
      .subscribe(
        res => {},
        err => {
          console.error(err);
        }
      );
  }

  /**
   * Initialize array of speed and delay
   * @param {any[]} speed
   * @param {any[]} delay
   * @memberof InformationService
   */
  initializeChartData(speed: any[], delay: any[]) {
    const DATA_LENGTH = 50;
    let now = new Date();
    now = new Date(now.getTime() - DATA_LENGTH * 1000);
    for (var i = 0; i < DATA_LENGTH; ++i) {
      // Push zero into array
      speed.push({
        name: now,
        value: [now, 0]
      });
      delay.push({
        name: now,
        value: [now, 0]
      });
      now = new Date(now.getTime() + 1000);
    }
  }
}
