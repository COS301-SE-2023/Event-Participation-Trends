import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import Konva from 'konva';
import HeatMap from 'heatmap-ts'
import 'chartjs-plugin-datalabels';

import ChartStreaming from 'chartjs-plugin-streaming';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IGetEventDevicePositionResponse, IGetEventFloorlayoutResponse, IGetEventResponse, IPosition } from '@event-participation-trends/api/event/util';
import { set } from 'mongoose';

interface IAverageDataFound {
  id: number | null | undefined,
  latLng: {
    oldDataPoint: L.LatLng | L.HeatLatLngTuple,
    newDataPoint: L.LatLng | L.HeatLatLngTuple
  },
  detectedThisRun: boolean
}

@Component({
  selector: 'event-participation-trends-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit {
  @ViewChild('heatmapContainer') heatmapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('totalUserCountChart') totalUserCountChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('totalDeviceCountChart') totalDeviceCountChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('userCountDataStreamingChart') userCountDataStreamingChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('flowmapContainer') flowmapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('totalDevicesBarChart') totalDevicesBarChart!: ElementRef<HTMLCanvasElement>;

  // Frontend
  isLoading = true;
  activeDevices = 4;
  inactiveDevices = 0;
  diviceCountChart = null;
  showToggle = false;
  showHeatmap = false;
  showFlowmap = false;

  // Functional
  eventStartTime: Date = new Date();
  eventEndTime: Date = new Date();

  // Cache
  floorlayoutScale = 1;
  floorlayoutStage : Konva.Stage | null = null;
  heatmap: HeatMap | null = null;
  heatmapData: {x: number, y: number, value: number, radius: number}[] = [];
  myHeatmap: any;
  myHeatLayer: any;
  myFlowmapLayer: any;
  oldHeatmapData: (L.LatLng | L.HeatLatLngTuple)[] = [];
  gridTilesDataPoints: {gridTile: HTMLDivElement, datapoints: IAverageDataFound[]}[] = [];
  hotzoneMarker: any;
  
  // Chart
  increasedUserCount = true;

  devicesBarChart: Chart | null = null;
  streamingUserCountChart: Chart | null = null;
  eventHours: string[] = []; // labels for the chart
  userDetectedPerHour: {time: string, detected: number}[] = []; // data for the chart
  usersDetectedPer5seconds: {time: string, detected: number}[] = []; // data for the chart
  streamingChartData: {labels: string[], data: number[]} = {labels: [], data: []};

  averageDataFound: {
    id: number | null | undefined,
    latLng: {
      oldDataPoint: L.LatLng | L.HeatLatLngTuple,
      newDataPoint: L.LatLng | L.HeatLatLngTuple
    },
    detectedThisRun: boolean
  }[] = [];
  eventId = '';
  totalUsersDetected = 0;
  totalUsersDetectedPrev = 0;
  averageDataDetectedThisRun: IAverageDataFound[] = [];
  allPosDetectedInCurrHour: {hour: string, positions: number[]} = {hour: '', positions: []};
  percentageIncreaseThanPrevHour = 0;
  grandTotalUsersDetected = 0;
  /**
   * The variables within the below block are used to determine the corrdinates of the
   * grid tiles on the flowmap layer. The grid tiles are used to determine the direction
   * of the arrows on the flowmap layer.
   * 
   * If you change the values of them, your grid map and heatmap will not work correctly.
   */
  // ====================================
  gridTileSize = 40.05;
  mapZoomLevel = 1;

  // center the map on the heatmap container such that the coordinates of the center point of the map is (0, 0)
  mapCenter = L.latLng(0, 0);
  mapXYCenter = [0,0];
  mapWidth = 0;
  mapHeight = 0;
  
  // set the bounds for the heatmap data points to be generated within (in x and y)
  heatmapBounds : L.LatLngBounds = L.latLngBounds(L.latLng(0, 0), L.latLng(0, 0));

  detectionRadius = 2;
  // ====================================

  constructor(private appApiService: AppApiService, private router : Router, private route: ActivatedRoute) {}

  public id = '';
  public event : any | null = null;
  public show = false;
  public loading = true;

  async ngOnInit() {
    
    this.id = this.route.parent?.snapshot.paramMap.get('id') || '';

    if (!this.id) {
      this.router.navigate(['/']);
    }

    this.event = await this.appApiService.getEvent({ eventId: this.id });

    const eventStartDate = this.event.StartDate;
    const eventEndDate = this.event.EndDate;
    
    if (eventStartDate) {
      this.eventStartTime = new Date(eventStartDate);
    }
    if (eventEndDate) {
      this.eventEndTime = new Date(eventEndDate);
    }

    this.loading = false;
    setTimeout(() => {
      this.show = true;
    }, 200);    
  }

  dateToString(date: Date) {
    return date.toString().replace(/( [A-Z]{3,4})$/, '').slice(0, 33);
  }

  ngAfterViewInit() {
    // wait until the heatmap container is rendered
    setTimeout(() => {
      // set the number of hours of the event
      //------- testing data
      this.eventStartTime = new Date();
      this.eventStartTime.setHours(this.eventStartTime.getHours() - 224);
      this.eventEndTime = new Date();
      this.eventEndTime.setHours(this.eventEndTime.getHours() + 8);
      //---------------
      let hoursOfEvent = 0;
      if (this.eventStartTime.getHours() > this.eventEndTime.getHours()) {
        hoursOfEvent = (24 - this.eventStartTime.getHours()) + this.eventEndTime.getHours();
      } else {
        hoursOfEvent = this.eventEndTime.getHours() - this.eventStartTime.getHours();
      }
      // set the labels of the x-axis
      for (let i = 0; i <= hoursOfEvent; i++) {
        let hours = '';
        let minutes = '';
        if (this.eventStartTime.getHours() + i < 10) {
          hours = `0${this.eventStartTime.getHours() + i}`;
        } 
        else {
          hours = `${this.eventStartTime.getHours() + i}`;
        }

        if (this.eventStartTime.getMinutes() < 10) {
          minutes = `0${this.eventStartTime.getMinutes()}`;
        }
        else {
          minutes = `${this.eventStartTime.getMinutes()}`;
        }

        this.eventHours.push(`${hours}:${minutes}`);
      }

      for (let i = 0; i < hoursOfEvent; i++) {
        this.userDetectedPerHour.push(
          {
            time: this.eventHours[i],
            detected: 0
          }
        )
      }
    
      setTimeout(() => {
        Chart.register(ChartStreaming);
        this.heatmap = new HeatMap({
          container: document.getElementById('view')!,
          maxOpacity: .6,
          radius: 50,
          blur: 0.90,
        });
        this.getImageFromJSONData(this.id);
        this.renderUserCountDataStreaming();
        this.renderTotalDevicesBarChart();
      }, 1000);
    }, 200);    

    const streamingInterval = setInterval(async () => {
      const now = new Date();

      if (now > this.eventEndTime) {
        clearInterval(streamingInterval);
      } else {

        // //! Testing purposes

        now.setHours(now.getHours() - 223);
        now.setMinutes(now.getMinutes() - 35);
        console.log(now);
        // get positions this interval

        const intervalStart = new Date(now.getTime() - 5000);
        const intervalEnd = now;

        const positions = await this.appApiService.getEventDevicePosition(this.id, intervalStart, intervalEnd);
        console.log(positions);
        // add to heatmap

        // check to see if we don't need to reset the all positions detected array (if we are in a new hour)
        if (this.allPosDetectedInCurrHour.hour !== now.getHours().toString()) {
          this.allPosDetectedInCurrHour.hour = now.getHours().toString();
          this.allPosDetectedInCurrHour.positions = [];
        }

        let data: {
          x: number,
          y: number,
          value: number,
          radius: number
        }[] = [];

        if (positions) {
          data = positions.map((position: IPosition) => {
            if (position.x != null && position.y != null) {
              return {
                x: position.x,
                y: position.y,
                value: 20,
                radius: 10
              };
            } else {
              return {
                x: 100,
                y: 100,
                value: 0,
                radius: 20
              };
            }
          });

          data.push({
            x: 100,
            y: 100,
            value: 0,
            radius: 20
          });

          this.heatmap?.setData({
            max: 100,
            min: 1,
            data: data
          });

          this.heatmapData = data;

          const unique_ids: number[] = [];
          for (let i = 0; i < positions.length; i++) {
            const position = positions[i];
            if (position.id && !unique_ids.includes(position.id)) {
              unique_ids.push(position.id);

              // add any new id detected to the all positions detected array
              if (!this.allPosDetectedInCurrHour.positions.includes(position.id)) {
                this.allPosDetectedInCurrHour.positions.push(position.id);
              }
            }

          }

          const newData = unique_ids.length;
          this.totalUsersDetectedPrev = this.totalUsersDetected;
          this.totalUsersDetected = newData;

          if (this.totalUsersDetectedPrev > this.totalUsersDetected) {
            this.increasedUserCount = false;
          }
          else {
            this.increasedUserCount = true;
          }

          const newTime = now.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
        
          if (this.streamingUserCountChart) {
            // add new label and data to the chart
            this.streamingUserCountChart.data.labels?.push(newTime);
            // add new data to the chart
            this.streamingUserCountChart.data.datasets[0].data?.push(newData);
            if (this.streamingUserCountChart.data.datasets[0].data?.length > 20) {
              // remove first label
              this.streamingUserCountChart.data.labels?.shift();
              // remove first data point
              this.streamingUserCountChart.data.datasets[0].data?.shift();
            }
            this.streamingUserCountChart.update();
          }

          // add new data to the streamingChartData
          this.streamingChartData.labels.push(newTime);
          this.streamingChartData.data.push(newData);
          // update the userDetectedPerHour array
          this.userDetectedPerHour.forEach((hour) => {
            // test if the hour is equal to the current hour
            if (hour.time.slice(0, 2) === newTime.slice(0, 2)) {
              // add one to the detected users
              hour.detected = this.allPosDetectedInCurrHour.positions.length;
            }
          });
          if (this.devicesBarChart) {
            this.devicesBarChart.data.datasets[0].data = this.userDetectedPerHour.map((hour) => hour.detected);
            this.devicesBarChart.data.labels = this.userDetectedPerHour.map((hour) => hour.time);
            this.devicesBarChart.update();
          }

          // sum the total users detected from every hour
          this.grandTotalUsersDetected = this.userDetectedPerHour.reduce((total, hour) => {
            return total + hour.detected;
          }, 0);

          // calculate the current percentage increase that the previous hour
          const prevHour = now.getHours() - 1;
          const prevHourPos = this.userDetectedPerHour.find(hour => hour.time === `${prevHour}:00`);
          if (prevHourPos) {
            const prevHourDetected = prevHourPos.detected;
            const currHourDetected = this.userDetectedPerHour.find(hour => hour.time === `${now.getHours()}:00`)?.detected;
            if (prevHourDetected && currHourDetected) {
              const percentageIncrease = ((currHourDetected - prevHourDetected) / prevHourDetected) * 100;
              this.percentageIncreaseThanPrevHour = percentageIncrease;
            }
          }
        }

      }
    }, 5000);
  }

  showToggleButton() {
    this.showToggle = true;
  }

  hideToggleButton() {
    this.showToggle = false;
  }

  removeArrowIconsFromGridTiles() {
    for (let i = 0; i < this.gridTilesDataPoints.length; i++) {
      const gridTile = this.gridTilesDataPoints[i].gridTile;
      const arrowIcon = gridTile.children.item(0);
      if (arrowIcon) {
        gridTile.removeChild(arrowIcon);
      }
    }
  }

  toggleHeatmap() {
    this.showHeatmap = !this.showHeatmap;
  }

  async getImageFromJSONData(eventId: string) {
    const response = await this.appApiService.getEventFloorLayout(eventId);
    if (response) {
      // use the response to create an image
      this.floorlayoutStage = new Konva.Stage({
        container: 'floormap',
        width: this.heatmapContainer.nativeElement.offsetWidth,
        height: this.heatmapContainer.nativeElement.offsetHeight
      });

      // create node from JSON string
      const layer: Konva.Layer = Konva.Node.create(response, 'floormap');
      // add the node to the layer
      this.floorlayoutStage.add(layer);
    }
  }

  renderUserCountDataStreaming() {
    const chartData: number[] = [];
    const chartLabels: string[] = [];

    this.streamingChartData.data.forEach((dataPoint) => {
      chartData.push(dataPoint);
    });

    this.streamingChartData.labels.forEach((label, index) => {
      chartLabels[index] = label;
    });

    const config: ChartConfiguration = {
      type: 'line',             // 'line', 'bar', 'bubble' and 'scatter' types are supported
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: false
          },
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Users Detected vs Time of Day (per 5 seconds)'
          }
        },
        scales: {
          x: {
              display: true,
            },
            y: {
              display: true,
              beginAtZero: true, 
            },
        }
      }
    };
    const userCountDataStreamingCanvas = this.userCountDataStreamingChart.nativeElement;

    if (userCountDataStreamingCanvas) {
      const userCountDataStreamingCtx = userCountDataStreamingCanvas.getContext('2d', { willReadFrequently: true });
      if (userCountDataStreamingCtx) {
        this.streamingUserCountChart = new Chart(
          userCountDataStreamingCtx, 
          config        
        );
      }
    }

  }

  renderTotalDevicesBarChart(){
    const chartData: number[] = [];
    const chartLabels: string[] = [];

    this.userDetectedPerHour.forEach((timeData) => {
      chartData.push(timeData.detected);
      chartLabels.push(timeData.time);
    });

    const data = {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          backgroundColor: [
            'rgb(34 197 94)'
          ],
          borderColor: [
            'rgb(34 197 94)'
          ],
          borderWidth: 1,
        }]
      };
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
            title: {
              display: true,
              text: 'Users Detected vs Time of day (per hour)', 
            },
            legend:{
                display: false
            },
            tooltip: {
              enabled: false
            }
          },
        scales: {
          x: {
            display: true, 
          },
          y: {
            display: true,
            beginAtZero: true,
          },
        }
      },
    };
    
    const deviceBarChartCanvas = this.totalDevicesBarChart.nativeElement;

    if (deviceBarChartCanvas) {
      const deviceBarChartCtx = deviceBarChartCanvas.getContext('2d');
      if (deviceBarChartCtx) {
        this.devicesBarChart = new Chart(
          deviceBarChartCanvas,
          config
        );
      }
    }
  }
}
