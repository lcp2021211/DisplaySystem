import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { InformationService } from 'src/app/utils/information.service';
import { NbThemeService } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { sec } from 'src/app/utils/global';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
})
export class InformationComponent implements OnInit, AfterViewInit, OnDestroy {
  settings: any = {
    columns: {
      ID: {
        title: '用户ID',
      },
      proxy: {
        title: '代理节点',
      },
      credit: {
        title: '评分',
      },
      timeSlot: {
        title: '时隙',
      },
      // attackStrength: {
      //   title: '攻击强度',
      // },
      // attackFrequency: {
      //   title: '攻击频率',
      // },
      block: {
        title: '封禁',
        valuePrepareFunction: (value) => {
          return value ? '是' : '否';
        },
      },
    },
    actions: false,
    hideSubHeader: true,
  };
  spies: any;
  spyPercent: number = 0;
  attackOption: EChartOption;
  percentOption: EChartOption;
  topologyOption: EChartOption;

  private config: any;
  private selected = 'all';

  private proxies = new Set();
  private clients: any;
  // private proxyToClients: any;

  private attackStrength = [];
  private attackFrequency = [];

  private timer: any;

  constructor(
    private service: InformationService,
    private theme: NbThemeService
  ) {}

  ngOnInit() {
    this.service.initializeChartData(this.attackFrequency, this.attackStrength);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  ngAfterViewInit() {
    // Subscribe theme changed
    this.theme.getJsTheme().subscribe((config) => {
      this.config = config;
    });

    this.timer = setInterval(() => {
      this.loadAttackInfo();
    }, sec);

    this.loadSpyInfo();
    this.loadSpyPercent();
    this.loadTopologyInfo();

  }

  /**
   * Select to show all proxies or only one
   * @param {string} item
   * @memberof InformationComponent
   */
  topologyChange(item: string) {
    this.selected = item;
    this.renderToplogy();
  }

  private loadAttackInfo() {
    this.service.getAttackInfo().subscribe((res: any) => {
      if (res.code === 200) {
        let now = new Date();
        this.attackFrequency.shift();
        this.attackFrequency.push({
          name: now,
          value: [now, res.attackFrequency],
        });
        this.attackStrength.shift();
        this.attackStrength.push({
          name: now,
          value: [now, res.attackStrength],
        });

        this.renderAttackInfo();
      }
    });
  }

  private renderAttackInfo() {
    this.attackOption = {
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
          },
        },
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
          },
        },
      ],
      series: [
        {
          name: '攻击频率',
          data: this.attackFrequency,
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
          name: '攻击强度',
          data: this.attackStrength,
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
  }

  private loadSpyInfo() {
    this.service.getSpyInfo().subscribe(
      (res: any) => {
        if (res.code === 200) {
          this.spies = res.data;
        }
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    );
  }

  private loadSpyPercent() {
    this.service.getSpyPercent().subscribe(
      (res: any) => {
        if (res.code === 200) {
          this.spyPercent = res.data;
          this.renderSpyPercent();
        }
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    );
  }

  private renderSpyPercent() {
    this.percentOption = {
      legend: {
        show: true,
        y: 'bottom',
        itemGap: 100,
        textStyle: {
          color: this.config.variables.fgText,
          fontSize: 20,
        },
      },
      series: [
        {
          type: 'pie',
          hoverAnimation: false,
          radius: ['45%', '75%'],
          data: [
            {
              value: 100 - this.spyPercent,
              name: '普通',
              itemStyle: {
                color: '#08D68F',
                opacity: 0,
              },
            },
            {
              value: this.spyPercent,
              name: '间谍',
              itemStyle: {
                color: '#FFB720',
              },
            },
          ],
          label: {
            show: false,
          },
        },
        {
          type: 'pie',
          hoverAnimation: false,
          radius: ['50%', '70%'],
          data: [
            {
              value: 100 - this.spyPercent,
              name: '普通',
              itemStyle: {
                color: '#08D68F',
              },
            },
            {
              value: this.spyPercent,
              name: '间谍',
              itemStyle: {
                color: '#FFB720',
              },
            },
          ],
          label: {
            formatter: '{d}%',
            fontSize: 15,
          },
        },
      ],
    };
  }


  /**
   * @private
   * @memberof InformationComponent
   */
  private loadTopologyInfo() {
    this.service.getTopologyInfo().subscribe(
      (res: any) => {
        if (res.code === 200) {
          // this.proxyToClients = res.data;
          this.clients = res.data;
          this.clients.forEach((e: any) => {
            this.proxies.add(e.proxy);
          });

          this.renderToplogy();
        }
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    );
  }

  /**
   * @private
   * @memberof InformationComponent
   */
  private renderToplogy() {
    let nodes = [];
    let links = [];

    // TODO(=====================Model 1=====================)
    // if (this.selected == 'all') {
    //   // Add Server
    //   nodes.push({
    //     name: 'Server',
    //     category: 'Server'
    //   });

    //   this.proxyToClients.forEach((e: any) => {
    //     // Add proxy nodes
    //     this.proxies.add(e.proxy);

    //     nodes.push({
    //       name: e.proxy,
    //       category: 'Proxy'
    //     });

    //     links.push({
    //       source: e.proxy,
    //       target: 'Server'
    //     });

    //     // Add client nodes and links
    //     e.client.forEach((client: any) => {
    //       nodes.push({
    //         name: `${client.ID}`,
    //         category: 'Client'
    //       });
    //       links.push({
    //         source: e.proxy,
    //         target: `${client.ID}`,
    //         lineStyle: {
    //           width: this.getLineWidth(client.networkSpeed),
    //           color: this.getLineColor(client.networkDelay)
    //         },
    //         emphasis: {
    //           lineStyle: {
    //             width: this.getLineWidth(client.networkSpeed, true),
    //             color: this.getLineColor(client.networkDelay, true)
    //           }
    //         }
    //       });
    //     });
    //   });

    // } else {
    //   // Add proxy node
    //   nodes.push({
    //     name: this.selected,
    //     category: 'Proxy'
    //   });

    //   this.proxyToClients.forEach((e: any) => {
    //     if (e.proxy === this.selected) {
    //       // Add client nodes
    //       e.client.forEach((client: any) => {
    //         nodes.push({
    //           name: `${client.ID}`,
    //           category: 'Client'
    //         });
    //         links.push({
    //           source: e.proxy,
    //           target: `${client.ID}`,
    //           lineStyle: {
    //             width: this.getLineWidth(client.networkSpeed),
    //             color: this.getLineColor(client.networkDelay)
    //           },
    //           label: {
    //             show: true,
    //             formatter: `Speed: ${client.networkSpeed.toFixed(2)}KB/s\nDelay: ${client.networkDelay.toFixed(2)}ms`,
    //             fontSize: 20,
    //             color: this.getLineColor(client.networkDelay)
    //           },
    //           emphasis: {
    //             lineStyle: {
    //               width: this.getLineWidth(client.networkSpeed, true),
    //               color: this.getLineColor(client.networkDelay, true)
    //             },
    //             label: {
    //               color: this.getLineColor(client.networkDelay, true)
    //             }
    //           }
    //         })
    //       })
    //     }
    //   });
    // }

    // TODO(=====================Model 2=====================)
    if (this.selected === 'all') {
      nodes.push({
        name: 'Server',
        category: 'Server',
      });

      this.proxies.forEach((proxy: any) => {
        nodes.push({
          name: proxy,
          category: 'Proxy',
        });
        links.push({
          source: proxy,
          target: 'Server',
        });
      });

      this.clients.forEach((client: any) => {
        nodes.push({
          name: `${client.ID}`,
          category: 'Client',
        });
        links.push({
          source: client.proxy,
          target: `${client.ID}`,
          lineStyle: {
            width: this.getLineWidth(client.networkSpeed),
            color: this.getLineColor(client.networkDelay),
          },
          emphasis: {
            lineStyle: {
              width: this.getLineWidth(client.networkSpeed, true),
              color: this.getLineColor(client.networkDelay, true),
            },
          },
        });
      });
    } else {
      nodes.push({
        name: this.selected,
        category: 'Proxy',
      });

      this.clients.forEach((client: any) => {
        if (client.proxy === this.selected) {
          nodes.push({
            name: `${client.ID}`,
            category: 'Client',
          });
          links.push({
            source: this.selected,
            target: `${client.ID}`,
            lineStyle: {
              width: this.getLineWidth(client.networkSpeed),
              color: this.getLineColor(client.networkDelay),
            },
            label: {
              show: true,
              formatter: `Speed: ${client.networkSpeed.toFixed(
                2
              )}KB/s\nDelay: ${client.networkDelay.toFixed(2)}ms`,
              fontSize: 20,
              color: this.getLineColor(client.networkDelay),
            },
            emphasis: {
              lineStyle: {
                width: this.getLineWidth(client.networkSpeed, true),
                color: this.getLineColor(client.networkDelay, true),
              },
              label: {
                color: this.getLineColor(client.networkDelay, true),
              },
            },
          });
        }
      });
    }

    this.topologyOption = {
      series: [
        {
          type: 'graph',
          layout: 'force',
          symbolSize: 80,
          categories: [
            {
              name: 'Proxy',
              symbol: 'image://assets/image/proxy.png',
            },
            {
              name: 'Client',
              symbol: 'image://assets/image/client.png',
            },
            {
              name: 'Server',
              symbol: 'image://assets/image/server.png',
            },
          ],
          roam: true,
          force: this.getForce(),
          label: {
            show: true,
            position: 'bottom',
            fontSize: 20,
            color: this.config.variables.fgText,
          },
          focusNodeAdjacency: true,
          lineStyle: {
            color: '#4f4f4f',
            width: 3,
            opacity: 1.0,
          },
          emphasis: {
            lineStyle: {
              width: 6,
              color: '#ADADAD',
            },
          },
          data: nodes,
          links: links,
        },
      ],
    };
  }

  /**
   * Get the width of line according to current network speed
   * @private
   * @param {number} speed
   * @param {boolean} [emphasis=false]
   * @returns {number}
   * @memberof InformationComponent
   */
  private getLineWidth(speed: number, emphasis = false): number {
    let width: number;
    if (speed <= 200) {
      width = 3;
    } else if (speed > 200 && speed <= 600) {
      width = 6;
    } else {
      width = 9;
    }
    if (emphasis) {
      width += 3;
    }
    return width;
  }

  /**
   * Get the color of line according to current delay
   * @private
   * @param {number} delay
   * @param {boolean} [emphasis=false]
   * @returns {string}
   * @memberof InformationComponent
   */
  private getLineColor(delay: number, emphasis = false): string {
    let color: string;
    if (delay <= 500) {
      color = '#5bc49f';
    } else if (delay > 500 && delay <= 1000) {
      color = '#feb64d';
    } else if (delay > 1000) {
      color = '#ff7c7c';
    }
    if (emphasis) {
      color += 'ff';
    } else {
      color += '99';
    }
    return color;
  }

  /**
   * Get the force according to the selected item
   * @private
   * @returns {any}
   * @memberof InformationComponent
   */
  private getForce(): any {
    if (this.selected === 'all') {
      return {
        repulsion: 500,
      };
    } else {
      return {
        repulsion: 5000,
      };
    }
  }
}
