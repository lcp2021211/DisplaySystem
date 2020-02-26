import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input
} from '@angular/core';
import { EChartOption } from 'echarts';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { InformationService } from 'src/app/utils/information.service';
import { HttpErrorResponse } from '@angular/common/http';
import { chunkSize, sec } from '../../../utils/global';

@Component({
  selector: 'app-download-card',
  templateUrl: './download-card.component.html',
  styleUrls: ['./download-card.component.css']
})
export class DownloadCardComponent implements OnInit, OnDestroy, AfterViewInit {
  private ws: WebSocket;
  private timer1: any;
  private timer2: any;
  private config: any;
  private isLive = true;
  private switchFlag = false;

  private t: DOMHighResTimeStamp;
  private chunkCount = 0;
  private start = 0;
  private end = 0;
  private fileSize = 0;
  private switchInterval = 5 * sec;

  @Input() showChart: boolean;
  @Input() user: string;
  speedOption: EChartOption;
  delayOption: EChartOption;
  clientID: number;
  progress = 0;
  delay = [];
  speed = [];
  block = false;
  switchCount = 0;

  private _proxy: string;
  set proxy(val: string) {
    if (val === 'null') {
      return;
    }
    if (this._proxy === undefined) {
      // First initialize proxy
      this._proxy = val;
      // Initial connection
      this.initializeWebSocket();
    } else if (this._proxy !== undefined && this._proxy !== val) {
      // Update proxy
      this._proxy = val;
      // Update switchFlag and switchCount
      this.switchFlag = true;
      this.switchCount += 1;
      // If websocket connection is open, then close it
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
      // Reconnect websocket
      this.initializeWebSocket();
    }
  }

  get proxy(): string {
    return this._proxy;
  }

  constructor(
    private service: InformationService,
    private theme: NbThemeService,
    private toast: NbToastrService
  ) {}

  ngOnInit() {
    // Initialize time record
    this.t = performance.now();
    // Initialize data of chart
    this.service.initializeChartData(this.speed, this.delay);

    this.service.distributeClient().subscribe(
      (res: any) => {
        if (res.code === 200) {
          // Get clientID and proxy
          this.clientID = res.clientID;
          this.proxy = res.proxy;

          // Start download and websocket connection
          this.download();
        }
      },
      (err: HttpErrorResponse) => {
        // Show error toast
        console.log(err);
        this.toast.show('', 'Get ClientID Error', { status: 'danger' });

        this.clientID = -1;
        this.proxy = 'null';
      }
    );
  }

  ngOnDestroy() {
    // Manually destroy timer and webSocket
    clearInterval(this.timer1);
    clearTimeout(this.timer2);
    this.isLive = false;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }

  ngAfterViewInit() {
    // Subscribe theme changed
    this.theme.getJsTheme().subscribe(config => {
      // Update theme config
      this.config = config;
    });

    this.timer1 = setInterval(() => {
      // Pop left data
      this.speed.shift();
      this.delay.shift();

      // Push new data
      let now = new Date();
      let interval = performance.now() - this.t;
      this.speed.push({
        name: now,
        value: [now, (1000 * chunkSize * this.chunkCount) / (1024 * interval)]
      });

      this.delay.push({
        name: now,
        value: [now, this.chunkCount === 0 ? 5000 : interval / this.chunkCount]
      });

      // Compute download progress
      this.progress = (this.start / this.fileSize) * 100;
      // Empty chunckCount
      this.chunkCount = 0;
      // Update time record
      this.t = performance.now();

      // // Post current speed and delay to server
      // this.service.postInformation(
      //   this.clientID,
      //   this.proxy,
      //   this.speed[this.speed.length - 1].value[1],
      //   this.delay[this.delay.length - 1].value[1]
      // );

      // // Get whether block
      // this.service.getBlock(this.clientID).subscribe(
      //   res => {
      //     if (res.code === 20000) {
      //       this.block = res.message.client[0].block;
      //       if (this.block) {
      //         this.ws.close();
      //       }
      //     }
      //   },
      //   err => {
      //     console.error(err);
      //   }
      // );

      this.speedOption = {
        grid: {
          y: '8%',
          y2: '8%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          }
        },
        yAxis: {
          min: 0,
          max: 300,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15
            }
          }
        },
        series: [
          {
            data: this.speed,
            type: 'line',
            color: '#3366FF',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              normal: {}
            }
          }
        ]
      };

      this.delayOption = {
        grid: {
          y: '8%',
          y2: '8%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          }
        },
        yAxis: {
          min: 0,
          max: 1500,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15
            }
          }
        },
        series: [
          {
            data: this.delay,
            type: 'line',
            symbol: 'none',
            smooth: true,
            areaStyle: {}
          }
        ],
        visualMap: {
          show: false,
          min: 0,
          max: 1500,
          inRange: {
            color: ['#5bc49f', '#feb64d', '#ff7c7c']
          }
        }
      };
    }, sec);

    this.autoSwitch();
  }

  /**
   * Auto switch proxy at interval
   * @private
   * @memberof DownloadCardComponent
   */
  private autoSwitch() {
    this.timer2 = setTimeout(() => {
      if (!this.switchFlag && !this.block) {
        this.service.redistributeClient(this.clientID, this.proxy).subscribe(
          (res: any) => {
            if (res.code === 200) {
              this.proxy = res.proxy;
            }
          },
          (err: HttpErrorResponse) => {
            console.log(err);
          }
        );
      }
      this.switchFlag = false;
      this.autoSwitch();
    }, this.switchInterval);
  }

  /**
   * Download video from proxy
   * @private
   * @memberof DownloadCardComponent
   */
  private async download() {
    await this.service
      .getVideoLength(this.proxy)
      .then(async (res: any) => {
        // Get the length of video(Bytes)
        this.fileSize = res.fileSize;
        // Initialize range(start, end)
        this.start = 0;
        this.end = Math.min(this.start + chunkSize, this.fileSize);
        // Downloading
        while (this.start < this.fileSize && !this.block && this.isLive) {
          await this.service
            .getVideoByRange(this.proxy, this.start, this.end)
            .then(() => {
              // Update chunckCount
              this.chunkCount++;
              // Update range(start, end)
              this.start = this.end;
              this.end = Math.min(this.start + chunkSize, this.fileSize);
            });
        }
        // Download completion
        // If current client isn't block and card component isn't destroyed
        // Then continue to download
        if (!this.block && this.isLive) {
          this.download();
        }
      })
      .catch(err => {
        // Catch error and retry it after 3 seconds
        console.error(err);
        setTimeout(() => {
          this.download();
        }, 3 * sec);
      });
  }

  /**
   * Initialize websocket connection
   * @private
   * @memberof DownloadCardComponent
   */
  private initializeWebSocket() {
    this.ws = new WebSocket(
      `ws://${this.proxy}/${this.clientID}/${this.user === 'client' ? 0 : 1}`,
      'echo-protocol'
    );
    this.ws.onopen = () => {
      console.log(`Websocket open: ${this.clientID}-->${this.ws.url}`);
    };
    this.ws.onmessage = event => {
      let message = JSON.parse(event.data);
      switch (message.type) {
        case 'switch':
          // Receive switch signal and update proxy
          this.proxy = message.content;
        default:
          break;
      }
    };
    this.ws.onclose = (event: CloseEvent) => {
      // console.log(`Websocket close: ${this.clientID}-->${this.ws.url}, Code: ${event.code}, Reason: ${event.reason}`);
      if (event.code !== 1000) {
        // TODO()
        // this.proxy = this.service.getProxy();
      }
    };
    this.ws.onerror = () => {
      // console.log(`Websocket error: ${this.clientID}-->${this.ws.url}`);
    };
  }
}
