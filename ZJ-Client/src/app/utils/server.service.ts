import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor() {}

  /**
   * @param {any[]} cpu
   * @param {any[]} memory
   * @param {any[]} bandwidth
   * @param {any[]} delay
   * @memberof ServerService
   */
  initializeChartData(
    cpu: any[],
    memory: any[],
    bandwidth: any[],
    delay: any[]
  ) {
    const DATA_LENGTH = 50;
    let now = new Date();
    now = new Date(now.getTime() - DATA_LENGTH * 1000);
    for (var i = 0; i < DATA_LENGTH; ++i) {
      // Push zero into array
      cpu.push({
        name: now,
        value: [now, 0],
      });
      memory.push({
        name: now,
        value: [now, 0],
      });
      bandwidth.push({
        name: now,
        value: [now, 0],
      });
      delay.push({
        name: now,
        value: [now, 0],
      });
      now = new Date(now.getTime() + 1000);
    }
  }
}
