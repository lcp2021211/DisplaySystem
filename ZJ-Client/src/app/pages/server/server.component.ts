import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { ServerService } from 'src/app/utils/server.service';
import { NbThemeService } from '@nebular/theme';
import { sec } from 'src/app/utils/global';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
})
export class ServerComponent implements OnInit {
  private timer: any;
  private config: any;

  cpuOption: EChartOption;
  memoryOption: EChartOption;
  bandwidthOption: EChartOption;
  delayOption: EChartOption;

  cpu = [];
  memory = [];
  bandwidth = [];
  delay = [];

  constructor(private service: ServerService, private theme: NbThemeService) {}

  ngOnInit() {
    this.service.initializeChartData(
      this.cpu,
      this.memory,
      this.bandwidth,
      this.delay
    );
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  ngAfterViewInit() {
    this.theme.getJsTheme().subscribe((config) => {
      this.config = config;
    });

    console.log(this.cpu);

    this.timer = setInterval(() => {
      this.cpu.shift();
      this.memory.shift();
      this.bandwidth.shift();
      this.delay.shift();

      let now = new Date();
      this.cpu.push({
        name: now,
        value: [now, Math.random() * 100],
      });
      this.memory.push({
        name: now,
        value: [now, Math.random() * 100],
      });
      this.bandwidth.push({
        name: now,
        value: [now, Math.random() * 500],
      });
      this.delay.push({
        name: now,
        value: [now, Math.random() * 1500],
      });

      this.cpuOption = {
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15,
            },
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#cccccc',
            },
          },
        },
        yAxis: {
          min: 0,
          max: 100,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#cccccc',
            },
          },
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15,
            },
          },
        },
        series: [
          {
            data: this.cpu,
            type: 'line',
            color: '#5FACFC',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x0: 0,
                y0: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(95,172,252,1.0)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(95,172,252,0.0)',
                  },
                ],
              },
            },
          },
        ],
      };

      this.memoryOption = {
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15,
            },
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#cccccc',
            },
          },
        },
        yAxis: {
          min: 0,
          max: 100,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#cccccc',
            },
          },
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15,
            },
          },
        },
        series: [
          {
            data: this.memory,
            type: 'line',
            color: '#5BC49F',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x0: 0,
                y0: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(91,196,159,1.0)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(91,196,159,0.0)',
                  },
                ],
              },
            },
          },
        ],
      };

      this.bandwidthOption = {
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15,
            },
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#cccccc',
            },
          },
        },
        yAxis: {
          min: 0,
          max: 500,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#cccccc',
            },
          },
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15,
            },
          },
        },
        series: [
          {
            data: this.bandwidth,
            type: 'line',
            color: '#FEB64C',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x0: 0,
                y0: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(254,182,76,1.0)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(254,182,76,0.0)',
                  },
                ],
              },
            },
          },
        ],
      };

      this.delayOption = {
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15,
            },
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#cccccc',
            },
          },
        },
        yAxis: {
          min: 0,
          max: 1500,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#cccccc',
            },
          },
          axisLabel: {
            textStyle: {
              color: this.config.variables.fgText,
              fontSize: 15,
            },
          },
        },
        series: [
          {
            data: this.memory,
            type: 'line',
            color: '#FA816D',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x0: 0,
                y0: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(250,129,109,1.0)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(250,129,109,0.0)',
                  },
                ],
              },
            },
          },
        ],
      };
    }, sec);
  }
}
