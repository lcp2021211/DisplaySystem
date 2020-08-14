import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { ServerService } from 'src/app/utils/server.service';
import { NbThemeService } from '@nebular/theme';
import { sec } from 'src/app/utils/global';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css'],
})
export class ServerComponent implements OnInit, OnDestroy, AfterViewInit {
  private data = {};
  private timer: any;
  private config: any;

  cpuOption: EChartOption;
  memOption: EChartOption;
  fsOption: EChartOption;
  netOption: EChartOption;

  constructor(private service: ServerService, private theme: NbThemeService) {}

  ngOnInit() {
    this.service.initializeChartData(this.data);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  ngAfterViewInit() {
    this.theme.getJsTheme().subscribe((config) => {
      this.config = config;
    });

    this.timer = setInterval(async () => {
      await this.service
        .getServerInfo()
        .then((res: any) => {
          if (res.code === 200) {
            let now = new Date();
            for (let key in this.data) {
              this.data[key].shift();
              this.data[key].push({
                name: now,
                value: [now, res[key]],
              });
            }

            this.renderChart();
          }
        })
        .catch((err: HttpErrorResponse) => {
          console.error(err);
        });
    }, 3 * sec);
  }

  private renderChart() {
    this.cpuOption = {
      grid: {
        left: '10%',
        right: '10%',
        top: '10%',
        bottom: '10%',
      },
      legend: {
        icon: 'roundRect',
        itemGap: 100,
        textStyle: {
          color: this.config.variables.fgText,
          fontSize: 15,
        },
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
      yAxis: [
        {
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
            formatter: '{value}%',
          },
        },
        {
          min: 0,
          max: 5,
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
            formatter: '{value}GHz',
          },
        },
      ],
      series: [
        {
          name: '使用率',
          data: this.data['cpuLoad'],
          type: 'line',
          color: '#2BE69B',
          smooth: true,
          symbol: 'none',
          yAxisIndex: 0,
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
                  color: 'rgba(43,230,155,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(43,230,155,0.0)',
                },
              ],
            },
          },
        },
        {
          name: '频率',
          data: this.data['cpuSpeed'],
          type: 'line',
          color: '#598BFF',
          smooth: true,
          symbol: 'none',
          yAxisIndex: 1,
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
                  color: 'rgba(89,139,255,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(89,139,255,0.0)',
                },
              ],
            },
          },
        },
      ],
    };

    this.memOption = {
      grid: {
        left: '10%',
        right: '10%',
        top: '10%',
        bottom: '10%',
      },
      legend: {
        icon: 'roundRect',
        itemGap: 100,
        textStyle: {
          color: this.config.variables.fgText,
          fontSize: 15,
        },
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
      yAxis: [
        {
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
            formatter: '{value}GB',
          },
        },
      ],
      series: [
        {
          name: '使用',
          data: this.data['memUsed'],
          type: 'line',
          color: '#FEC94D',
          smooth: true,
          symbol: 'none',
          yAxisIndex: 0,
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
                  color: 'rgba(254,201,77,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(254,201,77,0.0)',
                },
              ],
            },
          },
        },
        {
          name: '活跃',
          data: this.data['memActive'],
          type: 'line',
          color: '#FF708D',
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
                  color: 'rgba(255,112,141,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(255,112,141,0.0)',
                },
              ],
            },
          },
        },
        {
          name: '空闲',
          data: this.data['memFree'],
          type: 'line',
          color: '#2BE69B',
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
                  color: 'rgba(43,230,155,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(43,230,155,0.0)',
                },
              ],
            },
          },
        },
      ],
    };

    this.fsOption = {
      grid: {
        left: '10%',
        right: '10%',
        top: '10%',
        bottom: '10%',
      },
      legend: {
        icon: 'roundRect',
        itemGap: 100,
        textStyle: {
          color: this.config.variables.fgText,
          fontSize: 15,
        },
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
      yAxis: [
        {
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
            formatter: '{value}MB/s',
          },
        },
      ],
      series: [
        {
          name: '读取',
          data: this.data['fsRX'],
          type: 'line',
          color: '#FEC94D',
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
                  color: 'rgba(254,201,77,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(254,201,77,0.0)',
                },
              ],
            },
          },
        },
        {
          name: '写入',
          data: this.data['fsWX'],
          type: 'line',
          color: '#FF708D',
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
                  color: 'rgba(255,112,141,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(255,112,141,0.0)',
                },
              ],
            },
          },
        },
        {
          name: '总计',
          data: this.data['fsTX'],
          type: 'line',
          color: '#2BE69B',
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
                  color: 'rgba(43,230,155,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(43,230,155,0.0)',
                },
              ],
            },
          },
        },
      ],
    };

    this.netOption = {
      grid: {
        left: '10%',
        right: '10%',
        top: '10%',
        bottom: '10%',
      },
      legend: {
        icon: 'roundRect',
        itemGap: 100,
        textStyle: {
          color: this.config.variables.fgText,
          fontSize: 15,
        },
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
      yAxis: [
        {
          min: 0,
          max: 10,
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
            formatter: '{value}MB/s',
          },
        },
      ],
      series: [
        {
          name: '接收',
          data: this.data['netRX'],
          type: 'line',
          color: '#2BE69B',
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
                  color: 'rgba(43,230,155,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(43,230,155,0.0)',
                },
              ],
            },
          },
        },
        {
          name: '发送',
          data: this.data['netTX'],
          type: 'line',
          color: '#598BFF',
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
                  color: 'rgba(89,139,255,1.0)',
                },
                {
                  offset: 1,
                  color: 'rgba(89,139,255,0.0)',
                },
              ],
            },
          },
        },
      ],
    };
  }
}
