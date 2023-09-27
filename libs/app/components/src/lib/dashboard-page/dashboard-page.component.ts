import { CommonModule } from "@angular/common";
import { NgIconsModule, provideIcons } from "@ng-icons/core";
import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, NgZone } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import Konva from 'konva';
import HeatMap from 'heatmap-ts'
import 'chartjs-plugin-datalabels';

import ChartStreaming from 'chartjs-plugin-streaming';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute, Router } from '@angular/router';
import { IEvent, IGetEventDevicePositionResponse, IGetEventFloorlayoutResponse, IGetEventResponse, IImage, IPosition } from '@event-participation-trends/api/event/util';
import { set } from 'mongoose';

import { matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown } from "@ng-icons/material-icons/baseline";
import { matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { heroUserGroupSolid } from "@ng-icons/heroicons/solid";
import { heroBackward } from "@ng-icons/heroicons/outline";

interface IAverageDataFound {
  id: number | null | undefined,
  latLng: {
    oldDataPoint: L.LatLng | L.HeatLatLngTuple,
    newDataPoint: L.LatLng | L.HeatLatLngTuple
  },
  detectedThisRun: boolean
}

interface IHeatmapData {
  x: number,
  y: number,
  value: number,
  radius: number
}

@Component({
  selector: 'event-participation-trends-dashboard-page',
  standalone: true,
  imports: [CommonModule, NgIconsModule],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
  providers: [
    provideIcons({heroUserGroupSolid, heroBackward, matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown, matFilterCenterFocus, matZoomIn, matZoomOut})
  ]
})
export class DashboardPageComponent implements OnInit, AfterViewInit {
  @ViewChild('heatmapContainer') heatmapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('totalUserCountChart') totalUserCountChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('totalDeviceCountChart') totalDeviceCountChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('userCountDataStreamingChart') userCountDataStreamingChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('flowmapContainer') flowmapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('totalDevicesBarChart') totalDevicesBarChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('userCountDataStreamingChartSmall') userCountDataStreamingChartSmall!: ElementRef<HTMLCanvasElement>;
  @ViewChild('totalDevicesBarChartSmall') totalDevicesBarChartSmall!: ElementRef<HTMLCanvasElement>;
  
  // Frontend
  isLoading = true;
  activeDevices = 4;
  inactiveDevices = 0;
  diviceCountChart = null;
  showToggle = false;
  showHeatmap = false;
  showFlowmap = false;
  currentClampedScaleX = 1;
  currentClampedScaleY = 1;
  floorlayoutBounds: {top: number; left: number; right: number; bottom: number; } | null | undefined = null;
  showStatsOnSide = false;
  largeScreen = false;
  mediumScreen = false;
  floorlayoutSnapshot: string | null = null;  
  floorlayoutImages: IImage[] = [];
  STALL_IMAGE_URL = 'assets/stall-icon.png';
  noFloorPlan = false;

  // Functional
  eventStartTime: Date = new Date();
  eventEndTime: Date = new Date();
  timeOffset = 0;

  // Cache
  floorlayoutScale = 1;
  floorlayoutStage : Konva.Stage | null = null;
  heatmapLayer : Konva.Layer | null = null;
  heatmap: HeatMap | null = null;
  heatmapData: IHeatmapData[] = [];
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

  chartColors = {
    "ept-deep-grey": "#101010",
    "ept-bumble-yellow": "#facc15",
    "ept-off-white": "#F5F5F5",
    "ept-blue-grey": "#B1B8D4",
    "ept-navy-blue": "#22242A",
    "ept-light-blue": "#57D3DD",
    "ept-light-green": "#4ade80",
    "ept-light-red": "#ef4444"
  };
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

  constructor(private appApiService: AppApiService, private router : Router, private route: ActivatedRoute, private ngZone: NgZone) {}

  public id = '';
  public event : IEvent | null = null;
  public show = false;
  public loading = true;
  
  async ngOnInit() {
    
    this.id = this.route.parent?.snapshot.paramMap.get('id') || '';

    if (!this.id) {
      this.ngZone.run(() => { this.router.navigate(['/home']); });
    }
    this.event = await this.appApiService.getEvent({ eventId: this.id });

    if (!(await this.hasAccess()) && !((this.event as any).event.PublicEvent)) {
      this.ngZone.run(() => { this.router.navigate(['/home']); });
    }

    this.timeOffset = (new Date()).getTimezoneOffset() * 60 * 1000;
    

    // get the boundaries from the floorlayout
    const response = await this.appApiService.getFloorplanBoundaries(this.id);
    this.floorlayoutBounds = response?.boundaries;

    //get event floorplan    
    const layout = await this.appApiService.getEventFloorLayout(this.id);
    this.floorlayoutSnapshot = layout;
    if (!layout) {
      this.noFloorPlan = true;
    }

    const images = await this.appApiService.getFloorLayoutImages(this.id);
    this.floorlayoutImages = images;

    const eventStartDate = this.event.StartDate;
    const eventEndDate = this.event.EndDate;
    
    if (eventStartDate) {
      this.eventStartTime = new Date(eventStartDate);
      this.eventStartTime.setTime(this.eventStartTime.getTime() + this.timeOffset);
    }
    if (eventEndDate) {
      this.eventEndTime = new Date(eventEndDate);
      this.eventEndTime.setTime(this.eventEndTime.getTime() + this.timeOffset);
    }

    // test if window size is less than 700px
    if (window.innerWidth < 1300) {
      this.showStatsOnSide = false;
    }
    else {
      this.showStatsOnSide = true;
    } 

    if (window.innerWidth < 1024) {
      this.largeScreen = false;
    } else {
      this.largeScreen = true;
    }

    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      this.mediumScreen = true;
    } else {
      this.mediumScreen = false;
    }

    setTimeout(() => {
      this.show = true;
      this.loading = false;
    }, 1600);    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 1300) {
      this.showStatsOnSide = true;
    } else {
      this.showStatsOnSide = false;
    }

    if (event.target.innerWidth < 1024) {
      this.largeScreen = false;
    } else {
      this.largeScreen = true;
    }

    if (event.target.innerWidth >= 768 && event.target.innerWidth < 1024) {
      this.mediumScreen = true;
    } else {
      this.mediumScreen = false;
    }

    this.getImageFromJSONData(this.id);
    this.renderUserCountDataStreaming();
    this.renderTotalDevicesBarChart();
  }

  async hasAccess() {
    const role = await this.appApiService.getRole();

    if (role === 'admin') {
      return new Promise((resolve) => {
        resolve(true);
      });
    }

    const subscribed_events = await this.appApiService.getSubscribedEvents();

    for (const event of subscribed_events) {
      if ((event as any)._id === this.id) {
        return new Promise((resolve) => {
          resolve(true);
        });
      }
    }

    return new Promise((resolve) => {
      resolve(false);
    });
  }

  dateToString(date: Date) {
    return date.toString().replace(/( [A-Z]{3,4})$/, '').slice(0, 33);
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1600);
    // wait until the heatmap container is rendered
    setTimeout(() => {
      // set the number of hours of the event
      //------- testing data
      // this.eventStartTime = new Date();
      // this.eventStartTime.setHours(this.eventStartTime.getHours() - 411);
      // this.eventEndTime = new Date();
      // this.eventEndTime.setHours(this.eventEndTime.getHours() + 8);
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
          width: 1000,
          height: 1000,
          maxOpacity: .6,
          radius: 50,
          blur: 0.90,
          gradient: {
            0.0: this.chartColors['ept-off-white'],
            0.25: this.chartColors['ept-light-blue'],
            0.5: this.chartColors['ept-light-green'],
            0.75: this.chartColors['ept-bumble-yellow'],
            1.0: this.chartColors['ept-light-red']
          }
        });
        this.getImageFromJSONData(this.id);
        this.renderUserCountDataStreaming();
        this.renderTotalDevicesBarChart();
      }, 1000);
    }, 1000);    

    const streamingInterval = setInterval(async () => {
      const now = new Date();

      if (now > this.eventEndTime) {
        clearInterval(streamingInterval);
      } else {

        // //! Testing purposes

        // now.setHours(now.getHours() - 371);
        // now.setMinutes(now.getMinutes() - 0);

        // get positions this interval

        const intervalStart = new Date(now.getTime() - 5000);
        const intervalEnd = now;

        const gmTime = new Date(intervalStart.getTime() + this.timeOffset);
        const gmTimeEnd = new Date(intervalEnd.getTime() + this.timeOffset);

        const positions = await this.appApiService.getEventDevicePosition(this.id, gmTime, gmTimeEnd);
        // add to heatmap

        // check to see if we don't need to reset the all positions detected array (if we are in a new hour)
        if (this.allPosDetectedInCurrHour.hour !== now.getHours().toString()) {
          this.allPosDetectedInCurrHour.hour = now.getHours().toString();
          this.allPosDetectedInCurrHour.positions = [];
        }

        let data: IHeatmapData[] = [];

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
            x: 600, y: 100,
            value: 0,
            radius: 20
          });

          // this.heatmap?.setData({
          //   max: 100,
          //   min: 1,
          //   data: data
          // });
          this.setHeatmapData(data); // set the heatmap data based on zoom scale
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

    this.floorlayoutStage?.find('Layer').forEach((layer) => {
      if (layer.name() === 'heatmapLayer') {
        layer.visible(this.showHeatmap);        
      }

      // if (layer.name() === 'floorlayoutLayer') {
      //   // run through the layer and change the colors of the walls
      //   layer.getLayer()?.find('Path').forEach((path) => {
      //     if (path.name() == 'wall') {
      //       path.attrs.stroke = this.showHeatmap ? this.chartColors['ept-deep-grey'] : this.chartColors['ept-blue-grey'];
      //     }
      //   });
      //   // run through the layer and change the colors of the border of the sensors
      //   layer.getLayer()?.find('Circle').forEach((circle) => {
      //     if (circle.name() == 'sensor') {
      //       circle.attrs.stroke = this.showHeatmap ? this.chartColors['ept-deep-grey'] : this.chartColors['ept-blue-grey'];
      //     }
      //   });

      //   layer.getLayer()?.draw();
      // }
    });
  }

  setHeatmapData(data: IHeatmapData[]) {
    // remove the old heatmap layer
    this.floorlayoutStage?.find('Layer').forEach((layer) => {
      if (layer.name() === 'heatmapLayer') {
        layer.destroy();
      }
    });

    this.heatmap?.setData({
      max: 100,
      min: 1,
      data: data
    });

    this.heatmap?.repaint();

    // create an image from using the decoded base64 data url string
    // Create a new Image object
    const image = new Image();

    // Get the ImageData URL (base64 encoded) from this.heatmap?.getDataURL()
    const base64Url = this.heatmap?.getDataURL();

    if (base64Url) {
      image.src = base64Url;

      // Use the image's onload event to retrieve the dimensions
      image.onload = () => {
        const originalWidth = image.width;     // Width of the loaded image
        const originalHeight = image.height;   // Height of the loaded image

        // For example:
        const heatmapLayer = new Konva.Layer({
          name: 'heatmapLayer',
          visible: this.showHeatmap
        });
        const heatmapImage = new Konva.Image({
          image: image,
          x: 0,
          y: 0,
          width: originalWidth,
          height: originalHeight,
        });

        heatmapLayer.add(heatmapImage);
        this.floorlayoutStage?.add(heatmapLayer);
      };
    }

  }        

  async getImageFromJSONData(eventId: string) {
    const response = this.floorlayoutSnapshot;
    const imageResponse = this.floorlayoutImages;

    if (response || imageResponse) {
      // use the response to create an image
      this.floorlayoutStage = new Konva.Stage({
        container: 'floormap',
        width: this.heatmapContainer.nativeElement.offsetWidth * 0.98,
        height: this.heatmapContainer.nativeElement.offsetHeight * 0.98,
        draggable: true,
        visible: false,
      });

      // listen for when the stage is dragged and ensure teh following:
      // if the right side position is less than the width of the container, set the x position to the width of the container
      // if the left side position is greater than 0, set the x position to 0
      // if the bottom side position is less than the height of the container, set the y position to the height of the container
      // if the top side position is greater than 0, set the y position to 0
      this.floorlayoutStage.on('dragmove', () => {
        if (this.floorlayoutStage) {
          const stageX = this.floorlayoutStage.x();
          const stageY = this.floorlayoutStage.y();
          const stageWidth = this.floorlayoutStage.width() * this.floorlayoutStage.scaleX();
          const stageHeight = this.floorlayoutStage.height() * this.floorlayoutStage.scaleY();
          const containerWidth = this.heatmapContainer.nativeElement.offsetWidth *0.98;
          const containerHeight = this.heatmapContainer.nativeElement.offsetHeight *0.98;
          
          // the stage must move beyond the container width and height but the following must be taken into account
          // if the stage's left position is inline with the container's left position, set the stage's x position to equal the container's left position
          // meaning if we move to the right it does not matter but once we move left and the stage's left position is inline with the container's left position, set the stage's x position to equal the container's left position
          // if the stage's right position is inline with the container's right position, set the stage's x position to equal the container's right position - the stage's width
          // meaning if we move to the left it does not matter but once we move right and the stage's right position is inline with the container's right position, set the stage's x position to equal the container's right position - the stage's width
          // if the stage's top position is inline with the container's top position, set the stage's y position to equal the container's top position
          // meaning if we move down it does not matter but once we move up and the stage's top position is inline with the container's top position, set the stage's y position to equal the container's top position
          // if the stage's bottom position is inline with the container's bottom position, set the stage's y position to equal the container's bottom position - the stage's height
          // meaning if we move up it does not matter but once we move down and the stage's bottom position is inline with the container's bottom position, set the stage's y position to equal the container's bottom position - the stage's height

          if (this.floorlayoutStage.x() > 0) {
            this.floorlayoutStage.x(0);
          }
          if (this.floorlayoutStage.x() < containerWidth - stageWidth) {
            this.floorlayoutStage.x(containerWidth - stageWidth);
          }
          if (this.floorlayoutStage.y() > 0) {
            this.floorlayoutStage.y(0);
          }
          if (this.floorlayoutStage.y() < containerHeight - stageHeight) {
            this.floorlayoutStage.y(containerHeight - stageHeight);
          }
        }
      });

      // add rect to fill the stage
      // const rect = new Konva.Rect({
      //   x: 0,
      //   y: 0,
      //   width: this.floorlayoutStage.width(),
      //   height: this.floorlayoutStage.height(),
      //   fill: this.chartColors['ept-bumble-yellow'],
      //   stroke: this.chartColors['ept-light-blue'],
      //   strokeWidth: 20,
      // });

      // this.floorlayoutStage.add(new Konva.Layer().add(rect));

      if (response) {
        this.heatmapLayer = Konva.Node.create(response, 'floormap');
        if (this.heatmapLayer) {
          this.heatmapLayer?.setAttr('name', 'floorlayoutLayer');
  
          // run through the layer and set the components not to be draggable
          this.heatmapLayer?.children?.forEach(element => {
            element.draggable(false);
          });
  
          // run through the layer and change the colors of the walls
          this.heatmapLayer?.find('Path').forEach((path) => {
            if (path.name() == 'wall') {
              path.attrs.stroke = this.chartColors['ept-blue-grey'];
            }
          });
          // run through the layer and change the colors of the border of the sensors
          this.heatmapLayer?.find('Circle').forEach((circle) => {
            if (circle.name() == 'sensor') {
              circle.attrs.stroke = this.chartColors['ept-blue-grey'];
            }
          });
          // run through the layer and change the image attribute for the stalls
          this.heatmapLayer?.find('Group').forEach((group) => {
            if (group.name() == 'stall') {
              (group as Konva.Group).children?.forEach((child) => {
                if (child instanceof Konva.Image) {
                  const image = new Image();
                  image.onload = () => {
                    // This code will execute once the image has finished loading.
                    child.attrs.image = image;
                    this.heatmapLayer?.draw();
                  };
                  image.src = this.STALL_IMAGE_URL;
                }
              });
            }
          });
  
          imageResponse.forEach((image: any) => {
            const imageID = image._id;
            const imageSrc = image.imageBase64;
            let imageAttrs = image.imageObj;
            
            imageAttrs = JSON.parse(imageAttrs);
            const imageBackupID = imageAttrs.attrs.id;
      
            this.heatmapLayer?.find('Group').forEach((group) => {
              if (group.name() === 'uploadedFloorplan' && group.hasChildren()) {
                if ((group.getAttr('databaseID') === imageID) || group.getAttr('id') === imageBackupID) {
                    (group as Konva.Group).children?.forEach((child) => {
                      if (child instanceof Konva.Image) {
                        const image = new Image();
                        image.onload = () => {
                          // This code will execute once the image has finished loading.
                          child.attrs.image = image;
                          this.heatmapLayer?.draw();
                        };
                        image.src = imageSrc;
                      }
                    });
                  }
                }
              });
            });

          this.heatmapLayer.children?.forEach((child) => {
            if (child instanceof Konva.Group && (child.name() === 'uploadedFloorplan' && child.children?.length === 0)) {
              child.destroy();
              this.heatmapLayer?.draw();
            }
          });
  
          // // add the node to the layer
          this.floorlayoutStage.add(this.heatmapLayer);
        }
      }
      

      // add event listener to the layer for scrolling
      const zoomFactor = 1.2; // Adjust this as needed
      const minScale = 1; // Adjust this as needed
      const maxScale = 8.0; // Adjust this as needed

      this.floorlayoutStage.on('wheel', (e) => {
        if (this.floorlayoutStage) {
          e.evt.preventDefault(); // Prevent default scrolling behavior
      
          const oldScaleX = this.floorlayoutStage.scaleX();
          const oldScaleY = this.floorlayoutStage.scaleY();
      
          // Calculate new scale based on scroll direction
          const newScaleX = e.evt.deltaY > 0 ? oldScaleX / zoomFactor : oldScaleX * zoomFactor;
          const newScaleY = e.evt.deltaY > 0 ? oldScaleY / zoomFactor : oldScaleY * zoomFactor;
      
          // Apply minimum and maximum scale limits
          const clampedScaleX = Math.min(Math.max(newScaleX, minScale), maxScale);
          const clampedScaleY = Math.min(Math.max(newScaleY, minScale), maxScale);
      
          this.currentClampedScaleX = clampedScaleX;
          this.currentClampedScaleY = clampedScaleY;
      
          const zoomCenterX = this.floorlayoutStage.getPointerPosition()?.x;
          const zoomCenterY = this.floorlayoutStage.getPointerPosition()?.y;
      
          if (zoomCenterX && zoomCenterY) {
            if (clampedScaleX === minScale && clampedScaleY === minScale) {
              // Fully zoomed out - stop the user from zooming out further
              const oldScaleX = this.floorlayoutStage.scaleX();
              const oldScaleY = this.floorlayoutStage.scaleY();
              // Get the center of the viewport as the zoom center
              const zoomCenterX = this.floorlayoutStage.width() / 2;
              const zoomCenterY = this.floorlayoutStage.height() / 2;
          
              // Calculate new position for zoom center
              const newPosX = zoomCenterX - (zoomCenterX - this.floorlayoutStage.x()) * (clampedScaleX / oldScaleX);
              const newPosY = zoomCenterY - (zoomCenterY - this.floorlayoutStage.y()) * (clampedScaleY / oldScaleY);
          
              this.floorlayoutStage.x(newPosX);
              this.floorlayoutStage.y(newPosY);
              this.floorlayoutStage.scaleX(clampedScaleX);
              this.floorlayoutStage.scaleY(clampedScaleY);
            } else {
              // Calculate new position for zoom center
              const newPosX = zoomCenterX - (zoomCenterX - this.floorlayoutStage.x()) * (clampedScaleX / oldScaleX);
              const newPosY = zoomCenterY - (zoomCenterY - this.floorlayoutStage.y()) * (clampedScaleY / oldScaleY);
      
              this.floorlayoutStage.x(newPosX);
              this.floorlayoutStage.y(newPosY);
            }
      
            this.floorlayoutStage.scaleX(clampedScaleX);
            this.floorlayoutStage.scaleY(clampedScaleY);
          }

          console.log(this.floorlayoutStage.x(), this.floorlayoutStage.y());
        }
      });
      this.recenterFloorlayout();
    }
  }

  async recenterFloorlayout() {
    if (this.floorlayoutStage && this.floorlayoutBounds) {
      const minScale = 1; // Adjust this as needed
      const maxScale = 8.0; // Adjust this as needed

      const floorLayoutWidth = this.floorlayoutBounds.right - this.floorlayoutBounds.left;
      const floorLayoutHeight = this.floorlayoutBounds.bottom - this.floorlayoutBounds.top;
      
      // Get the dimensions of the viewport
      const viewportWidth = this.floorlayoutStage.width(); // Width of the viewport
      const viewportHeight = this.floorlayoutStage.height(); // Height of the viewport

      // Calculate the aspect ratios of the layout and the viewport
      const layoutAspectRatio = floorLayoutWidth / floorLayoutHeight;
      const viewportAspectRatio = viewportWidth / viewportHeight;

      // Calculate the zoom level based on the aspect ratios
      let zoomLevel;

      if (layoutAspectRatio > viewportAspectRatio) {
        // The layout is wider, so fit to the width
        zoomLevel = viewportWidth / floorLayoutWidth;
      } else {
        // The layout is taller, so fit to the height
        zoomLevel = viewportHeight / floorLayoutHeight;
      }

      // Apply minimum and maximum scale limits
      const clampedZoomLevel = Math.min(Math.max(zoomLevel, minScale), maxScale);

      const zoomCenterX = floorLayoutWidth / 2;
      const zoomCenterY = floorLayoutHeight / 2;

      // Calculate the new dimensions of the floor layout after applying the new scale
      const newLayoutWidth = floorLayoutWidth * clampedZoomLevel;
      const newLayoutHeight = floorLayoutHeight * clampedZoomLevel;

      // Calculate the required translation to keep the map centered while fitting within the viewport
      const translateX = (viewportWidth - newLayoutWidth) / 2 - zoomCenterX * (clampedZoomLevel - 1);
      const translateY = (viewportHeight - newLayoutHeight) / 2 - zoomCenterY * (clampedZoomLevel - 1);

      // Apply the new translation and scale
      this.floorlayoutStage.x(translateX);
      this.floorlayoutStage.y(translateY);
      this.floorlayoutStage.scaleX(clampedZoomLevel);
      this.floorlayoutStage.scaleY(clampedZoomLevel);
      this.floorlayoutStage.visible(true);
    }
  }

  zoomIn() {
    if (this.floorlayoutStage) {
      const oldScaleX = this.floorlayoutStage.scaleX();
      const oldScaleY = this.floorlayoutStage.scaleY();
  
      // Calculate new scale based on zoom in factor
      const newScaleX = oldScaleX * 1.2;
      const newScaleY = oldScaleY * 1.2;
  
      // Apply minimum and maximum scale limits
      const clampedScaleX = Math.min(Math.max(newScaleX, 1), 8);
      const clampedScaleY = Math.min(Math.max(newScaleY, 1), 8);
  
      this.currentClampedScaleX = clampedScaleX;
      this.currentClampedScaleY = clampedScaleY;
  
      // Get the center of the viewport as the zoom center
      const zoomCenterX = this.floorlayoutStage.width() / 2;
      const zoomCenterY = this.floorlayoutStage.height() / 2;
  
      // Calculate new position for zoom center
      const newPosX = zoomCenterX - (zoomCenterX - this.floorlayoutStage.x()) * (clampedScaleX / oldScaleX);
      const newPosY = zoomCenterY - (zoomCenterY - this.floorlayoutStage.y()) * (clampedScaleY / oldScaleY);
  
      this.floorlayoutStage.x(newPosX);
      this.floorlayoutStage.y(newPosY);
      this.floorlayoutStage.scaleX(clampedScaleX);
      this.floorlayoutStage.scaleY(clampedScaleY);
    }
  }
  
  zoomOut() {
    if (this.floorlayoutStage) {
      // zoom out should work as follows
      // if we zoom out and a side exceeded its boundaries then set the x or y position to the boundary

      const oldScaleX = this.floorlayoutStage.scaleX();
      const oldScaleY = this.floorlayoutStage.scaleY();

      // Calculate new scale based on zoom out factor
      const newScaleX = oldScaleX / 1.2;
      const newScaleY = oldScaleY / 1.2;

      // Apply minimum and maximum scale limits
      const clampedScaleX = Math.min(Math.max(newScaleX, 1), 8);
      const clampedScaleY = Math.min(Math.max(newScaleY, 1), 8);

      this.currentClampedScaleX = clampedScaleX;
      this.currentClampedScaleY = clampedScaleY;

      // Get the center of the viewport as the zoom center
      const zoomCenterX = this.floorlayoutStage.width() / 2;
      const zoomCenterY = this.floorlayoutStage.height() / 2;

      // now check if the new position exceeds the boundaries of the container
      const containerWidth = this.heatmapContainer.nativeElement.offsetWidth *0.98;
      const containerHeight = this.heatmapContainer.nativeElement.offsetHeight *0.98;
      const stageWidth = this.floorlayoutStage.width() * clampedScaleX;
      const stageHeight = this.floorlayoutStage.height() * clampedScaleY;

      let xFixed = false;
      let yFixed = false;

      if (this.floorlayoutStage.x() > 0) {
        this.floorlayoutStage.x(0);
        xFixed = true;
      }
      if (this.floorlayoutStage.x() < containerWidth - stageWidth) {
        this.floorlayoutStage.x(containerWidth - stageWidth);
        xFixed = true;
      }
      if (this.floorlayoutStage.y() > 0) {
        this.floorlayoutStage.y(0);
        yFixed = true;
      }
      if (this.floorlayoutStage.y() < containerHeight - stageHeight) {
        this.floorlayoutStage.y(containerHeight - stageHeight);
        yFixed = true;
      }

      // Calculate new position for zoom center
      const newPosX = zoomCenterX - (zoomCenterX - this.floorlayoutStage.x()) * (clampedScaleX / oldScaleX);
      const newPosY = zoomCenterY - (zoomCenterY - this.floorlayoutStage.y()) * (clampedScaleY / oldScaleY);

      if (!xFixed) {
        this.floorlayoutStage.x(newPosX);
      }
      if (!yFixed) {
        this.floorlayoutStage.y(newPosY);
      }

      this.floorlayoutStage.scaleX(clampedScaleX);
      this.floorlayoutStage.scaleY(clampedScaleY);
      
    }
  }
  

  renderUserCountDataStreaming() {
    // check if canvas is already in use
    if (this.streamingUserCountChart) {
      this.streamingUserCountChart.destroy();
    }

    const chartData: number[] = [];
    const chartLabels: string[] = [];

    this.streamingChartData.data.forEach((dataPoint) => {
      chartData.push(dataPoint);
    });

    this.streamingChartData.labels.forEach((label, index) => {
      chartLabels[index] = label;
    });

    const ctx: CanvasRenderingContext2D | null = this.userCountDataStreamingChart.nativeElement?.getContext("2d");

    // let ctx: CanvasRenderingContext2D | null;
    
    // if (this.largeScreen) {
    //   ctx = this.userCountDataStreamingChart.nativeElement?.getContext("2d");
    // } else {
    //   ctx = this.userCountDataStreamingChartSmall.nativeElement?.getContext("2d");
    // }
    
    let gradientStroke = null;
    if (ctx) {
      gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
      gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
      gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          // borderColor: 'white',  // Set the line color to white
          // backgroundColor: 'rgba(255, 255, 255, 0.2)',  // Adjust the background color of the line
          fill: true,
          backgroundColor: gradientStroke ? gradientStroke : 'white',
          borderColor: this.chartColors['ept-bumble-yellow'],
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: this.chartColors['ept-bumble-yellow'],
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: this.chartColors['ept-bumble-yellow'],
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: false
          },
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Users Detected vs Time of Day (per 5 seconds)',
            color: this.chartColors['ept-off-white'],  // Set the title text color to white
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',  // Adjust the color of the x-axis grid lines
            },
            ticks: {
              color: this.chartColors['ept-blue-grey'],  // Adjust the color of the x-axis labels
            }
          },
          y: {
            display: true,
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',  // Adjust the color of the y-axis grid lines
            },
            ticks: {
              color: this.chartColors['ept-blue-grey'],  // Adjust the color of the y-axis labels
            }
          },
        },
        elements: {
          line: {
            tension: 0.3,  // Adjust the tension of the line for a smoother curve
          },
        },
      }
    };
    const userCountDataStreamingCanvas = this.userCountDataStreamingChart.nativeElement;
    // let userCountDataStreamingCanvas;
    // if (this.largeScreen) {
    //   userCountDataStreamingCanvas = this.userCountDataStreamingChart.nativeElement;
    // } else {
    //   userCountDataStreamingCanvas = this.userCountDataStreamingChartSmall.nativeElement;
    // }


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
    // check if canvas is already in use
    if (this.devicesBarChart) {
      this.devicesBarChart.destroy();
    }

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
            this.chartColors['ept-light-blue'],
          ],
          borderRadius: 5,
          borderWidth: 0,
        }]
      };
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
              display: true,
              text: 'Users Detected vs Time of day (per hour)', 
              color: this.chartColors['ept-off-white'],  // Set the title text color to white
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
            ticks: {
              color: this.chartColors['ept-blue-grey'],  // Adjust the color of the x-axis labels
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',  // Adjust the color of the y-axis grid lines
            },
          },
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              color: this.chartColors['ept-blue-grey'],  // Adjust the color of the y-axis labels
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',  // Adjust the color of the y-axis grid lines
            },
          },
        }
      },
    };
    
    const deviceBarChartCanvas = this.totalDevicesBarChart.nativeElement;
    // let deviceBarChartCanvas;
    
    // if (this.largeScreen) {
    //   deviceBarChartCanvas = this.totalDevicesBarChart.nativeElement;
    // } else {
    //   deviceBarChartCanvas = this.totalDevicesBarChartSmall.nativeElement;
    // }

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
