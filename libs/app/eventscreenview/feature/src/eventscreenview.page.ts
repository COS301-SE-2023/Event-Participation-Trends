import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import Konva from 'konva';
import HeatMap from 'heatmap-ts'

import 'chartjs-plugin-datalabels';

import ChartStreaming from 'chartjs-plugin-streaming';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute } from '@angular/router';
import { IGetEventDevicePositionResponse, IGetEventFloorlayoutResponse, IGetEventResponse, IPosition } from '@event-participation-trends/api/event/util';
import { set } from 'mongoose';
import { Select, Store } from '@ngxs/store';
import { EventScreenViewState } from '@event-participation-trends/app/eventscreenview/data-access';
import { Observable } from 'rxjs';
import { SetEndTime, SetStartTime, SetCurrentTime, UpdateUsersDetectedPerHour, SetStreamingChartData } from '@event-participation-trends/app/eventscreenview/util';

interface IAverageDataFound {
  id: number | null | undefined,
  latLng: {
    oldDataPoint: L.LatLng | L.HeatLatLngTuple,
    newDataPoint: L.LatLng | L.HeatLatLngTuple
  },
  detectedThisRun: boolean
}

@Component({
  selector: 'event-participation-trends-eventscreenview',
  templateUrl: './eventscreenview.page.html',
  styleUrls: ['./eventscreenview.page.css'],
})
export class EventScreenViewPage {
  @Select(EventScreenViewState.currentTime) currentTime$!: Observable<Date>;
  @Select(EventScreenViewState.startTime) startTime$!: Observable<Date>;
  @Select(EventScreenViewState.endTime) endTime$!: Observable<Date>;
  @Select(EventScreenViewState.usersDetectedPerHour) usersDetectedPerHour$!: Observable<{time: string, detected: number}[]>;
  @Select(EventScreenViewState.streamingChartData) streamingChartData$!: Observable<{labels: string[], data: number[]}>;

  @ViewChild('heatmapContainer') heatmapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('totalUserCountChart') totalUserCountChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('totalDeviceCountChart') totalDeviceCountChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('userCountDataStreamingChart') userCountDataStreamingChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('flowmapContainer') flowmapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('totalDevicesBarChart') totalDevicesBarChart!: ElementRef<HTMLCanvasElement>;

  // Frontend
  isLoading = true;
  activeDevices = 25;
  inactiveDevices = 5;
  diviceCountChart = null;
  showToggle = false;
  showHeatmap = false;
  showFlowmap = false;

  // Functional
  eventStartTime: Date = new Date();
  eventEndTime: Date = new Date();

  // Cache
  heatmap: any;
  myHeatmap: any;
  myHeatLayer: any;
  myFlowmapLayer: any;
  oldHeatmapData: (L.LatLng | L.HeatLatLngTuple)[] = [];
  gridTilesDataPoints: {gridTile: HTMLDivElement, datapoints: IAverageDataFound[]}[] = [];
  hotzoneMarker: any;
  
  // Chart
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
  averageDataDetectedThisRun: IAverageDataFound[] = [];

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

  constructor(
    private readonly appApiService: AppApiService,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.eventId = params['id'];
      });

      if (this.eventId) {
        this.appApiService.getFloorplanBoundaries(this.eventId).then((response) => {
          if (response && response.boundaries) {
            const center = {
              x: (response.boundaries.left + response.boundaries.right) / 2,
              y: (response.boundaries.top + response.boundaries.bottom) / 2
            };

            this.mapCenter = L.latLng(this.convertXYToLatLng(center.x, center.y));
            this.mapXYCenter = [center.x, center.y];
            this.mapWidth = response.boundaries.right - response.boundaries.left;
            this.mapHeight = response.boundaries.bottom - response.boundaries.top;
            this.heatmapBounds = L.latLngBounds(L.latLng(this.mapCenter), L.latLng(this.convertXYToLatLng(response.boundaries.right, response.boundaries.bottom)));
          }
        });

        // get event
        this.appApiService.getEvent({eventId: this.eventId}).subscribe((response) => {
          if (response) {
            const eventStartDate = response.event.StartDate;
            const eventEndDate = response.event.EndDate;
            
            if (eventStartDate) {
              
              this.eventStartTime = eventStartDate;
            }
            if (eventEndDate) {
              this.eventEndTime = eventEndDate;
            }
          }
        });
      }      
  }

  dateToString(date: Date) {
    return date.toString().replace(/( [A-Z]{3,4})$/, '').slice(0, 33);
  }

  async ngAfterViewInit() {
     // wait until the heatmap container is rendered
     setTimeout(() => {
      this.isLoading = false;

      this.eventStartTime = new Date();
      this.eventStartTime.setHours(this.eventStartTime.getHours() - 10);
      this.eventEndTime = new Date();
      this.eventEndTime.setHours(this.eventEndTime.getHours() + 8);
    
      // set the number of hours of the event
      let hoursOfEvent = 0;
      if (this.eventStartTime.getHours() > this.eventEndTime.getHours()) {
        hoursOfEvent = (24 - this.eventStartTime.getHours()) + this.eventEndTime.getHours();
      } else {
        hoursOfEvent = this.eventEndTime.getHours() - this.eventStartTime.getHours();
      }
      // set the labels of the x-axis
      for (let i = 0; i <= hoursOfEvent; i++) {
        // check if the minutes are less than 10, if so, add a 0 in front of the minutes
        if (this.eventStartTime.getMinutes() < 10 && this.eventStartTime.getHours() < 10) {
          this.eventHours.push(`${this.eventStartTime.getHours() + i}:0${this.eventStartTime.getMinutes()}`);
        } else if (this.eventStartTime.getMinutes() < 10 && this.eventStartTime.getHours() >= 10) {
          this.eventHours.push(`${this.eventStartTime.getHours() + i}:0${this.eventStartTime.getMinutes()}`);
        } else if (this.eventStartTime.getHours() < 10 && this.eventStartTime.getMinutes() >= 10) {
          this.eventHours.push(`${this.eventStartTime.getHours() + i}:${this.eventStartTime.getMinutes()}`);
        } else {
          this.eventHours.push(`${this.eventStartTime.getHours() + i}:${this.eventStartTime.getMinutes()}`);
        } 
      }

      for (let i = 0; i < hoursOfEvent; i++) {
        this.userDetectedPerHour.push(
          {
            time: this.eventHours[i],
            detected: 0
          }
        )
      }
  
      this.store.dispatch(new UpdateUsersDetectedPerHour(this.userDetectedPerHour));
  
       // get average data points up to the current time to load heatmap
    
       setTimeout(() => {
         Chart.register(ChartStreaming);
         this.heatmap = new HeatMap({
          container: document.getElementById('view')!,
          maxOpacity: .6,
          radius: 50,
          blur: 0.90,
         })
         this.getImageFromJSONData(this.eventId);
         this.renderTotalUserCount();
         this.renderTotalDeviceCount();
         this.renderUserCountDataStreaming();
         this.renderTotalDevicesBarChart();
       }, 1000);
    }, 1000);    

    const streamingInterval = setInterval(async () => {
      const now = new Date();

      if (now > this.eventEndTime) {
        clearInterval(streamingInterval);
      } else {

        //! Testing purposes

        now.setHours(now.getHours() - 10);
        now.setMinutes(now.getMinutes() - 30);

        // get positions this interval

        const intervalStart = new Date(now.getTime() - 5000);
        const intervalEnd = now;

        const positions = await this.appApiService.getEventDevicePosition(this.eventId, intervalStart, intervalEnd);
        console.log(positions);

        // add to heatmap

        let data: {
          x: number,
          y: number,
          value: number,
          radius: number
        }[] = [];

        
        data = positions!.positions!.map((position: IPosition) => {
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
        })

        data.push({
          x: 100,
          y: 100,
          value: 0,
          radius: 20
        });

        this.heatmap.setData({
          max: 100,
          min: 1,
          data: data
        });


        const unique_ids: number[] = [];
        for (let i = 0; i < positions!.positions!.length; i++) {
          const position = positions!.positions![i];
          if (!unique_ids.includes(position.id!)) {
            unique_ids.push(position.id!);
          }
        }

        const newData = unique_ids.length;
        this.totalUsersDetected = newData;
        const newTime = now.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
       
        // add new label and data to the chart
        this.streamingUserCountChart?.data.labels?.push(newTime);
        // add new data to the chart
        this.streamingUserCountChart?.data.datasets[0].data?.push(newData);
        if (this.streamingUserCountChart!.data.datasets[0].data?.length > 20) {
          // remove first label
          this.streamingUserCountChart?.data.labels?.shift();
          // remove first data point
          this.streamingUserCountChart?.data.datasets[0].data?.shift();
        }
        this.streamingUserCountChart?.update();

        // add new data to the streamingChartData
        this.streamingChartData.labels.push(newTime);
        this.streamingChartData.data.push(newData);
        // update the streamingChartData in the store
        this.store.dispatch(new SetStreamingChartData(this.streamingChartData));

      }
    }, 5000);
  }

  convertXYToLatLng(x: number, y: number): [number, number] {
    // Step 1: Determine the bounds of your (x, y) coordinate system
    const xMin = 0; // Minimum x-value of your coordinate system
    const xMax = 1140; // Maximum x-value of your coordinate system
    const yMin = 0; // Minimum y-value of your coordinate system
    const yMax = 460; // Maximum y-value of your coordinate system
  
    // Step 2: Scale and shift (x, y) to match desired latitude and longitude ranges
    const latMin = -90; // Minimum desired latitude
    const latMax = 90; // Maximum desired latitude
    const lngMin = -180; // Minimum desired longitude
    const lngMax = 180; // Maximum desired longitude
  
    const latitude = latMin + ((y - yMin) / (yMax - yMin)) * (latMax - latMin);
    const longitude = lngMin + ((x - xMin) / (xMax - xMin)) * (lngMax - lngMin);
  
    return [latitude, longitude];
  }

  // getAverageDatapointsUptoNow() {
  //   const eventId = this.eventId;
  //   const startOfInterval = new Date(this.startOfTimeInterval);
  //   let endInterval = new Date(this.currentTime);
  //   const endTime = new Date(this.endTime);

  //   if (endInterval >= endTime) {
  //     endInterval = endTime;
  //   }

  //   //make one api call
  //   const response = this.appApiService.getEventDevicePosition(eventId, startOfInterval, endInterval);
  //   response.then((res) => {
  //     if (res?.positions) {
  //       this.averageDataFound = this.getGroupedDatapoints(res.positions);

  //       // set streaming chart data
  //       this.usersDetectedPer5seconds.forEach((dataPoint) => {
  //         this.streamingChartData.labels.push(dataPoint.time);
  //         this.streamingChartData.data.push(dataPoint.detected);
  //       });

  //       this.store.dispatch(new SetStreamingChartData(this.streamingChartData));
  //     }
  //   });    
  // }

  // getGroupedDatapoints(datapoints: IPosition[]) {
  //   // run through the list of datapoints and group them in a 5 second interval based on the object's 'timestamp' property
  //   const groupedDatapoints = this.groupDatapoints(datapoints);

  //   // calculate the average position of each group of datapoints
  //   this.averageDataFound = [];

  //   groupedDatapoints.forEach((group) => {
  //     group.forEach((position: IPosition) => {
  //       const latLng = this.calculateAverageXandY(group, position);
  
  //       // convert x and y coordinates to lat and lng coordinates
  //       // const latLng = L.latLng(this.convertXYToLatLng(averageX, averageY));
  //       // add new average data point to the averageDataFound array
  //       this.averageDataFound.push({
  //         id: position.id, 
  //         latLng: {
  //         oldDataPoint: latLng,
  //         newDataPoint: latLng
  //         },
  //         detectedThisRun: true
  //       });
  //     });
  //   });

  //   return this.averageDataFound;
  // }

  // groupDatapoints(datapoints: IPosition[]): IPosition[][] {
  //   const groupedDatapoints: IPosition[][] = [];
  //   let group: IPosition[] = [];
  //   let currentTimestamp = new Date(this.startOfTimeInterval);
  //   for (const datapoint of datapoints) {
  //     if (datapoint.timestamp) {
  //       const timestamp = new Date(datapoint.timestamp);
  //       if (timestamp.getTime() - currentTimestamp.getTime() <= 5000) {
  //         group.push(datapoint);
  //       } else {
  //         groupedDatapoints.push(group);

  //         // add total users detected in this group to the totalUsersDetected array
  //         this.usersDetectedPer5seconds.push({
  //           time: `${currentTimestamp.getHours()}:${currentTimestamp.getMinutes()}:${currentTimestamp.getSeconds()}`,
  //           detected: group.length,
  //         });

  //         // add data group in the correct hour
  //         const hour = currentTimestamp.getHours();
  //         if (this.userDetectedPerHour[hour]) {
  //           this.userDetectedPerHour[hour].detected += group.length;
  //         } else {
  //           this.userDetectedPerHour[hour] = {
  //             time: `${currentTimestamp.getHours()}:00`,
  //             detected: group.length,
  //           };
  //         }

  //         group = [];
  //         group.push(datapoint);
  //         currentTimestamp = timestamp;
  //       }
  //     }
  //   }
  //   return groupedDatapoints;
  // }


  // getAverageData() {
  //   // extract event id from url
  //   const eventId = this.eventId;  

  //   // set current time
  //   this.currentTime$.subscribe((currentTime: Date) => {
  //     this.currentTime = currentTime.toString().replace(/( [A-Z]{3,4})$/, '').slice(0, 33);
  //   });
  //   const startOfInterval = new Date(this.startOfTimeInterval);
  //   let endOfInterval: Date;
  //   if (this.currentTime === this.startOfTimeInterval) {
  //     endOfInterval = new Date(startOfInterval.getTime() + 5000);
  //   } else {
  //     endOfInterval = new Date(this.currentTime);
  //     this.startOfTimeInterval = this.currentTime;
  //   }
  //   this.endTime = endOfInterval.toString().replace(/( [A-Z]{3,4})$/, '');
    
  //   const response = this.appApiService.getEventDevicePosition(eventId, startOfInterval, endOfInterval);
    
  //   // set new current time
  //   this.store.dispatch(new SetCurrentTime(endOfInterval));
    
  //   this.startOfTimeInterval = endOfInterval.toString().replace(/( [A-Z]{3,4})$/, '').slice(0, 33);
  
  //   response.then((data: IGetEventDevicePositionResponse | null | undefined) => {
  //     if (data?.positions) {
  //       this.averageDataFound = this.updateHeatmapData(data.positions);
  //     }
  //   });

  // }

  // updateHeatmapData(positions: IPosition[]) {
  //   if (this.averageDataFound.length === 0) {
  //     positions.forEach((position: IPosition) => {
  //       const latLng = this.calculateAverageXandY(positions, position);

  //       // convert x and y coordinates to lat and lng coordinates
  //       // const latLng = L.latLng(this.convertXYToLatLng(averageX, averageY));
  //       // add new average data point to the averageDataFound array
  //       this.averageDataFound.push({
  //         id: position.id, 
  //         latLng: {
  //         oldDataPoint: latLng,
  //         newDataPoint: latLng
  //         },
  //         detectedThisRun: true
  //       });
  //     });
  //     return this.averageDataFound;

  //   } else {
  //     // set all detectedThisRun properties of the average data points to false
  //     this.averageDataFound.forEach((averageDataPoint: IAverageDataFound) => {
  //       averageDataPoint.detectedThisRun = false;
  //     });

  //     //determine new/old positions detected this run
  //     positions.forEach((position: IPosition) => {
  //       const latLng = this.calculateAverageXandY(positions, position);

  //       // convert x and y coordinates to lat and lng coordinates
  //       // const latLng = this.myHeatmap.containerPointToLatLng(L.point(averageX, averageY));

  //       // determine if there already exists an average data point with the same id
  //       const existingPoint = this.averageDataFound.find((averageDataPoint: IAverageDataFound) => {
  //         if (averageDataPoint.id === position.id) {
  //           // update the old data point of the average data point
  //           averageDataPoint.latLng.oldDataPoint = averageDataPoint.latLng.newDataPoint;
  //           // update the new data point of the average data point
  //           averageDataPoint.latLng.newDataPoint = latLng;

  //           // set detectedThisRun property to true
  //           averageDataPoint.detectedThisRun = true;
  //         }

  //         return averageDataPoint.id === position.id;
  //       });

  //       // if there is no existing average data point with the same id, add a new one
  //       if (!existingPoint) {
  //         this.averageDataFound.push({
  //           id: position.id,
  //           latLng: {
  //             oldDataPoint: latLng,
  //             newDataPoint: latLng
  //           },
  //           detectedThisRun: true
  //         });
  //       }
  //     });

  //     return this.averageDataFound;
  //   }
  // }

  // calculateAverageXandY(positions: IPosition[], position: IPosition): L.LatLng {
  //   // retrieve all data postions with the same id
  //   const positionsWithSameId = positions.filter((pos: IPosition) => pos.id === position.id);

  //   const positionsWithSameId_LatLng: L.LatLng[] = [];
  //   positionsWithSameId.map((pos: IPosition) => {
  //     if (pos.x != null && pos.y != null) {
  //       let latLng = L.latLng(this.convertXYToLatLng(pos.x, pos.y));
  //       latLng = L.latLng(latLng);
  //       positionsWithSameId_LatLng.push(latLng);
  //     }
  //   });

  //   const averageX = positionsWithSameId_LatLng.reduce((acc: number, curr: {lat: number, lng: number}) => {
  //     if (curr.lng) {
  //       return acc + curr.lng;
  //     } else {
  //       return acc;
  //     }
  //   }, 0) / positionsWithSameId_LatLng.length;

  //   const averageY = positionsWithSameId_LatLng.reduce((acc: number, curr: {lat: number, lng: number}) => {
  //     if (curr.lat) {
  //       return acc + curr.lat;
  //     } else {
  //       return acc;
  //     }
  //   }, 0) / positionsWithSameId_LatLng.length;

  //   return L.latLng(averageX, averageY);
  // }

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

    if (this.showHeatmap) {
      this.myHeatLayer = L.heatLayer(
        [],
        {
          radius: 10,
          gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' },
          minOpacity: 0.6
        }
      ).addTo(this.myHeatmap);
    } else {
      this.myHeatmap.removeLayer(this.myHeatLayer);
    }
  }

  // renderHeatMap() {
  //   this.myHeatmap = L.map(this.heatmapContainer.nativeElement).setView(this.mapCenter, this.mapZoomLevel);

  //   //disable zoom functionality
  //   this.myHeatmap.touchZoom.disable();
  //   this.myHeatmap.doubleClickZoom.disable();
  //   this.myHeatmap.scrollWheelZoom.disable();
  //   this.myHeatmap.boxZoom.disable();
  //   this.myHeatmap.keyboard.disable();
  //   this.myHeatmap.dragging.disable();

  //   // disable zoom in and out buttons
  //   this.myHeatmap.removeControl(this.myHeatmap.zoomControl);
  //   this.myHeatmap.removeControl(this.myHeatmap.attributionControl);

  //   // The line below loads a snapshot of the floor layout
  //   this.getImageFromJSONData(this.eventId);

  //   // get bounds of heatmap container
  //   const imageBounds: L.LatLngBounds = L.latLngBounds(
  //     this.myHeatmap.containerPointToLatLng(L.point(0, 0)),
  //     this.myHeatmap.containerPointToLatLng(L.point(this.heatmapContainer.nativeElement.offsetWidth, this.heatmapContainer.nativeElement.offsetHeight))
  //   );

    

    // const myGrid = L.GridLayer.extend({
    //   options: {
    //     tileSize: this.gridTileSize,
    //     opacity: 0.9,
    //     zIndex: 1000,
    //     bounds: imageBounds,
    //   },
    //   // Override _tileCoordsToBounds function
    //   _tileCoordsToBounds: function (coords: any) {
    //     const tileSize = this.getTileSize();
    //     const nwPoint = coords.scaleBy(tileSize);
    //     const sePoint = nwPoint.add(tileSize);
    //     const nw = this._map.unproject(nwPoint, coords.z);
    //     const se = this._map.unproject(sePoint, coords.z);
    //     return L.latLngBounds(nw, se);
    //   },
    //   // By default, the container for a whole zoom level worth of visible tiles
    //   // has a "pointer-events: none" CSS property. Override this whenever a new
    //   // level container is created. This is needed for pointer (mouse) interaction.
    //   _onCreateLevel: function(level: any) {
    //     level.el.style.pointerEvents = 'inherit';
    //   },
    //   createTile: (coords: any) => {
    //     const tile = L.DomUtil.create('div', 'grid-tile');
    //     // tile.style.background = 'rgba(209 213 219, 0.4)';
    //     tile.style.background = 'rgba(0, 0, 0, 0.1)';
    //     tile.style.border = 'solid 1px rgba(0, 0, 0, 0.2)';
    //     tile.style.fontSize = '10px';
    //     tile.style.color = 'rgba(0, 0, 0, 0.5)';
    //     tile.style.textAlign = 'center';

    //     return tile;
    //   }
    // });

    // this.myFlowmapLayer = new myGrid();

  //   this.myFlowmapLayer.addTo(this.myHeatmap);
  // }

  getImageFromJSONData(eventId: string) {
    const response = this.appApiService.getEventFloorLayout(eventId);
    response.subscribe((res: IGetEventFloorlayoutResponse) => {
      // use the response to create an image
      const stage = new Konva.Stage({
        container: 'floormap',
        width: this.heatmapContainer.nativeElement.offsetWidth,
        height: this.heatmapContainer.nativeElement.offsetHeight
      });

      // create node from JSON string
      const layer: Konva.Layer = Konva.Node.create(res.floorlayout, 'floormap');
      // add the node to the layer
      stage.add(layer);

      // // set the src of the image to the image url
      // layer.toDataURL({
      //   callback: (dataUrl: string) => {
      //     const imageBounds: L.LatLngBounds = L.latLngBounds(
      //       this.myHeatmap.containerPointToLatLng(L.point(0, 0)),
      //       this.myHeatmap.containerPointToLatLng(L.point(this.heatmapContainer.nativeElement.offsetWidth, this.heatmapContainer.nativeElement.offsetHeight))
      //     );
      //     L.imageOverlay(dataUrl, imageBounds, {zIndex: 0}).addTo(this.myHeatmap);
      //   }
      // });
    });
  }

  getHotZone(heatmapData: (L.LatLng | L.HeatLatLngTuple)[]) {
    let maxIntensity = 0;
    let hotZone: L.LatLng = L.latLng(0, 0);

    heatmapData.forEach((data: any) => {
      const intensity = data[2];
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        hotZone = L.latLng(data[0], data[1]);
      }
    });

    return hotZone;
  }

  generateHeatmapData() {
    /*
      Note: Most of the funtionality in this method is used for testing purposes only.
      Once we have real data we can remove the testing code and replace it with the real data.
    */

    const heatmapData: (L.LatLng | L.HeatLatLngTuple)[] = []; 
  
    if (this.oldHeatmapData.length === 0)  {
        for (let i = 0; i < 50; i++) {
        const latitude = 0 + Math.random() * (this.heatmapBounds.getNorth() + this.heatmapBounds.getSouth());
        const longitude = 0 + Math.random() * (this.heatmapBounds.getEast() + this.heatmapBounds.getWest());
        const intensity = 0.5 + Math.random() * 0.5;
    
        this.oldHeatmapData.push([latitude, longitude, intensity]);
      }
    } 

    // Function to generate a random number between min and max (inclusive)
    const getRandomNumber = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
  
    // Maximum distance a data point can be moved (adjust this value as needed)
    const maxDisplacement = 10; // Adjust this value to control the displacement
  
    this.oldHeatmapData.forEach((dataPoint: L.LatLng | L.HeatLatLngTuple) => {
      // Check if dataPoint is L.LatLng or L.HeatLatLngTuple
      if ('lat' in dataPoint && 'lng' in dataPoint) {
        // It's an L.LatLng type
        const latLngDataPoint = dataPoint as L.LatLng;
    
        const latDisplacement = getRandomNumber(-maxDisplacement, maxDisplacement);
        const lngDisplacement = getRandomNumber(-maxDisplacement, maxDisplacement);
    
        latLngDataPoint.lat += latDisplacement; // Latitude
        latLngDataPoint.lng += lngDisplacement; // Longitude
    
        // Make sure the updated data point stays within the defined bounds
        latLngDataPoint.lat = Math.max(this.heatmapBounds.getSouth(), Math.min(this.heatmapBounds.getNorth(), latLngDataPoint.lat)); // Latitude
        latLngDataPoint.lng = Math.max(this.heatmapBounds.getWest(), Math.min(this.heatmapBounds.getEast(), latLngDataPoint.lng)); // Longitude
      } else {
        // It's a HeatLatLngTuple type
        const heatLatLngDataPoint = dataPoint as L.HeatLatLngTuple;
    
        const latDisplacement = getRandomNumber(-maxDisplacement, maxDisplacement);
        const lngDisplacement = getRandomNumber(-maxDisplacement, maxDisplacement);
    
        heatLatLngDataPoint[0] += latDisplacement; // Latitude
        heatLatLngDataPoint[1] += lngDisplacement; // Longitude
    
        // Make sure the updated data point stays within the defined bounds
        heatLatLngDataPoint[0] = Math.max(this.heatmapBounds.getSouth(), Math.min(this.heatmapBounds.getNorth(), heatLatLngDataPoint[0])); // Latitude
        heatLatLngDataPoint[1] = Math.max(this.heatmapBounds.getWest(), Math.min(this.heatmapBounds.getEast(), heatLatLngDataPoint[1])); // Longitude
      }
    });

    heatmapData.push(...this.oldHeatmapData);
  
    return heatmapData;
  }

  renderTotalUserCount() {
    const data = {
      datasets: [{
        label: 'Total Users',
        data: [0],
        backgroundColor: [
          '#0000FF',
        ],
        borderColor: [
          '#0000FF',
        ],
      }]
    };

    const userCountCanvas = this.totalUserCountChart.nativeElement;

    if (userCountCanvas) {
      const userCountCtx = userCountCanvas.getContext('2d', { willReadFrequently: true });
      if (userCountCtx) {
        const myChart = new Chart(
          userCountCtx,
          {
            type: 'doughnut',
            data: data,
            options: {
              responsive: true,
              cutout: '80%',
              plugins: {
                tooltip: {
                  enabled: false
                },
              },          
            },
            plugins: [
              {
                id: 'center-label-devices',
                beforeDraw: function (chart: any) {
                  const width = chart.width;
                  const height = chart.height;
                  const ctx = chart.ctx;
                  
                  // set font size to 30px
                  ctx.font = '30px Poppins';
                  
                  ctx.restore();
                  ctx.textBaseline = 'middle';
        
                  const text = chart.data.datasets[0].data[0];
                  const textX = Math.round((width - ctx.measureText(text).width) / 2);
                  const textY = height / 2 + 5;
        
                  ctx.fillText(text, textX, textY);
                  ctx.save();
                }
              }
            ]
          }
        );

        setInterval(() => {
          myChart.data.datasets[0].data[0] = this.totalUsersDetected;
          myChart.update();
        });
      }
    }
  }

  renderTotalDeviceCount() {
    const data = {
      datasets: [{
        label: 'Devices',
        data: [this.activeDevices, this.inactiveDevices],
        backgroundColor: [
          'rgb(34 197 94)',
          '#FF0000',
        ],
        borderColor: [
          'rgb(34 197 94)',
          '#FF0000',
        ],
      }]
    };

    const deviceCountCanvas = this.totalDeviceCountChart.nativeElement;

    if (deviceCountCanvas) {
      const deviceCountCtx = deviceCountCanvas.getContext('2d', { willReadFrequently: true });
      if (deviceCountCtx) {
        const myChart = new Chart(
          deviceCountCtx,
          {
            type: 'doughnut',
            data: data,
            options: {
              responsive: true,
              cutout: '80%',
              plugins: {
                tooltip: {
                  enabled: false
                },
              }
            },
            plugins: [
              {
                id: 'center-label-devices',
                beforeDraw: function (chart: any) {
                  const width = chart.width;
                  const height = chart.height;
                  const ctx = chart.ctx;
                  
                  // set font size to 30px
                  ctx.font = '30px Poppins';
                  
                  ctx.restore();
                  ctx.textBaseline = 'middle';
        
                  const text = chart.data.datasets[0].data[0] + chart.data.datasets[0].data[1];
                  const textX = Math.round((width - ctx.measureText(text).width) / 2);
                  const textY = height / 2 + 5;
        
                  ctx.fillText(text, textX, textY);
                  ctx.save();
                }
              }
            ]
          }
        );
      }
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
        labels: chartLabels,             // empty at the beginning
        datasets: [{
          data: chartData,              // empty at the beginning
        }]
      },
      options: {
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
              title: {
                display: true,
                text: 'Time of day',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Users Detected', 
              },
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
    // const randomData = [];
    // for (let i = 0; i < this.eventHours.length; i++) {
    //   randomData.push({
    //     x: this.eventHours[i],
    //     y: Math.floor(Math.random() * 100)
    //   });
    // }

    const chartData: {
      x: string,
      y: number
    }[] = [];

    this.userDetectedPerHour.forEach((timeData) => {
      chartData.push({
        x: timeData.time,
        y: timeData.detected
      });
    });

    const data = {
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
    
    const deviceBarChartCanvas = this.totalDevicesBarChart.nativeElement;

    if (deviceBarChartCanvas) {
      const deviceBarChartCtx = deviceBarChartCanvas.getContext('2d');
      if (deviceBarChartCtx) {
        const myChart = new Chart(
          deviceBarChartCanvas,
          {
            type: 'bar',
            data: data,
            options: {
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
                    title: {
                    display: true,
                    text: 'Time of day',
                  },
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Number of Users Detected', 
                  },
                  beginAtZero: true, 
                },
              }
            },
          }
        );
      }
    }
  }
}
