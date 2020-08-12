import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterViewInit,
} from '@angular/core';
import { ProxyService } from 'src/app/utils/proxy.service';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-proxy-card',
  templateUrl: './proxy-card.component.html',
  styleUrls: ['./proxy-card.component.css'],
})
export class ProxyCardComponent implements OnInit, OnDestroy, AfterViewInit {
  private data = {};
  private _selected: string;
  private _info: any;

  option: EChartOption;
  @Input() config: any;
  @Input() proxy: string;
  @Input() set selected(val: string) {
    this._selected = val;
    this.service.initializeChartData(this.data);
  }
  get selected() {
    return this._selected;
  }
  @Input() set info(val: any) {
    this._info = val;
    let now = new Date();
    for (let key in this.data) {
      this.data[key].shift();
      this.data[key].push({
        name: now,
        value: [now, this.info[key]],
      });
    }

    this.renderChart();
  }
  get info() {
    return this._info;
  }

  constructor(private service: ProxyService) {}

  ngOnInit() {
    console.log('ngOnInit');
    this.service.initializeChartData(this.data);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  private renderChart() {
    switch (this.selected) {
      case 'cpu':
        this.option = {
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
              name: 'Usage',
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
              name: 'Speed',
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
        break;
      case 'mem':
        this.option = {
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
              name: 'Used',
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
              name: 'Active',
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
              name: 'Free',
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
        break;
      case 'fs':
        this.option = {
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
              name: 'RX',
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
              name: 'WX',
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
              name: 'TX',
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
        break;
      case 'net':
        this.option = {
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
              name: 'RX',
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
              name: 'TX',
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
        break;
      default:
        break;
    }
  }
}
