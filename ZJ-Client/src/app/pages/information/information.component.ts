import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { InformationService } from 'src/app/utils/information.service';
import { NbThemeService } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
})
export class InformationComponent implements OnInit, AfterViewInit, OnDestroy {
  settings: any = {
    columns: {
      id: {
        title: 'ID',
      },
      proxy: {
        title: 'Proxy',
      },
      credit: {
        title: 'Credit',
      },
      strength: {
        title: 'Attack Strength',
      },
      frequency: {
        title: 'Attack Frequency',
      },
    },
    actions: false,
    hideSubHeader: true,
  };
  datas: any;
  topologyOption: EChartOption;
  percentOption: EChartOption;

  private config: any;
  private selected = 'all';

  private proxies = new Set();
  private clients: any;
  // private proxyToClients: any;

  constructor(
    private service: InformationService,
    private theme: NbThemeService
  ) {}

  ngOnInit() {
    // Subscribe theme changed
    this.theme.getJsTheme().subscribe((config) => {
      this.config = config;
    });

    this.loadData();
  }

  ngOnDestroy() {}

  ngAfterViewInit() {}

  /**
   * Select to show all proxies or only one
   * @param {string} item
   * @memberof InformationComponent
   */
  topologyChange(item: string) {
    this.selected = item;
    this.loadToplogy();
  }

  /**
   * Load realtime information(speed, delay) from server
   */
  loadData() {
    this.service.getTopologyInfo().subscribe(
      (res: any) => {
        if (res.code === 200) {
          // this.proxyToClients = res.data;
          this.clients = res.data;
          this.clients.forEach((e: any) => {
            this.proxies.add(e.proxy);
          });

          this.loadToplogy();
        }
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    );

    this.datas = [
      {
        proxy: '192.168.2.0',
        id: 15,
        credit: 1200,
        strength: 10,
        frequency: 1,
      },
      {
        proxy: '192.168.2.1',
        id: 12,
        credit: 200,
        strength: 20,
        frequency: 2,
      },
      {
        proxy: '192.168.2.2',
        id: 20,
        credit: 800,
        strength: 10,
        frequency: 0,
      },
      {
        proxy: '192.168.2.3',
        id: 26,
        credit: 2000,
        strength: 200,
        frequency: 10,
      },
    ];

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
              value: 60,
              name: 'Normal',
              itemStyle: {
                color: '#08D68F',
                opacity: 0,
              },
            },
            {
              value: 40,
              name: 'Spy',
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
              value: 60,
              name: 'Normal',
              itemStyle: {
                color: '#08D68F',
              },
            },
            {
              value: 40,
              name: 'Spy',
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

  /**
   * Load the topology.
   * @private
   * @memberof InformationComponent
   */
  private loadToplogy() {
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
}
