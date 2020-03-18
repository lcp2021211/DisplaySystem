import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { TopologyService } from 'src/app/utils/topology.service';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'app-topology',
  templateUrl: './topology.component.html',
  styleUrls: ['./topology.component.css']
})
export class TopologyComponent implements OnInit, AfterViewInit {
  topologyOption: EChartOption;

  private config: any;
  private selected = 'all';

  private proxies = new Set();
  private proxyToClients: any;

  constructor(
    private service: TopologyService,
    private theme: NbThemeService
  ) {}

  ngOnInit() {
    // Subscribe theme changed
    this.theme.getJsTheme().subscribe(config => {
      this.config = config;
    });

    this.loadData();
  }

  ngAfterViewInit() {}

  /**
   * Select to show all proxies or only one
   * @param {string} item
   * @memberof TopologyComponent
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
      res => {
        if (res.code === 200) {
          this.proxyToClients = res.data;

          this.loadToplogy();
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  /**
   * Get the width of line according to current network speed
   * @private
   * @param {number} speed
   * @param {boolean} [emphasis=false]
   * @returns {number}
   * @memberof TopologyComponent
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
   * @memberof TopologyComponent
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
   * @memberof TopologyComponent
   */
  private getForce(): any {
    if (this.selected === 'all') {
      return {
        repulsion: 500
      };
    } else {
      return {
        repulsion: 5000
      };
    }
  }

  /**
   * Load the topology.
   * @private
   * @memberof TopologyComponent
   */
  private loadToplogy() {
    let nodes = [];
    let links = [];

    if (this.selected == 'all') {
      // Add Server
      nodes.push({
        name: 'Server',
        category: 'Server'
      });

      this.proxyToClients.forEach((e: any) => {
        // Add proxy nodes
        this.proxies.add(e.proxy);
        
        nodes.push({
          name: e.proxy,
          category: 'Proxy'
        });

        links.push({
          source: e.proxy,
          target: 'Server'
        });

        // Add client nodes and links
        e.client.forEach((client: any) => {
          nodes.push({
            name: `${client.ID}`,
            category: 'Client'
          });
          links.push({
            source: e.proxy,
            target: `${client.ID}`,
            lineStyle: {
              width: this.getLineWidth(client.networkSpeed),
              color: this.getLineColor(client.networkDelay)
            },
            emphasis: {
              lineStyle: {
                width: this.getLineWidth(client.networkSpeed, true),
                color: this.getLineColor(client.networkDelay, true)
              }
            }
          });
        });
      });

    } else {
      // Add proxy node
      nodes.push({
        name: this.selected,
        category: 'Proxy'
      });

      this.proxyToClients.forEach((e: any) => {
        if (e.proxy === this.selected) {
          // Add client nodes
          e.client.forEach((client: any) => {
            nodes.push({
              name: `${client.ID}`,
              category: 'Client'
            });
            links.push({
              source: e.proxy,
              target: `${client.ID}`,
              lineStyle: {
                width: this.getLineWidth(client.networkSpeed),
                color: this.getLineColor(client.networkDelay)
              },
              label: {
                show: true,
                formatter: `Speed: ${client.networkSpeed.toFixed(2)}KB/s\nDelay: ${client.networkDelay.toFixed(2)}ms`,
                fontSize: 20,
                color: this.getLineColor(client.networkDelay)
              },
              emphasis: {
                lineStyle: {
                  width: this.getLineWidth(client.networkSpeed, true),
                  color: this.getLineColor(client.networkDelay, true)
                },
                label: {
                  color: this.getLineColor(client.networkDelay, true)
                }
              }
            })
          })
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
              symbol: 'image://assets/image/proxy.png'
            },
            {
              name: 'Client',
              symbol: 'image://assets/image/client.png'
            },
            {
              name: 'Server',
              symbol: 'image://assets/image/server.png'
            }
          ],
          roam: true,
          force: this.getForce(),
          label: {
            show: true,
            position: 'bottom',
            fontSize: 20,
            color: this.config.variables.fgText
          },
          focusNodeAdjacency: true,
          lineStyle: {
            color: '#4f4f4f',
            width: 3,
            opacity: 1.0
          },
          emphasis: {
            lineStyle: {
              width: 6,
              color: '#ADADAD'
            }
          },
          data: nodes,
          links: links
        }
      ]
    };
  }
}
