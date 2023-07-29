import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import 'luxon';
import 'chartjs-adapter-luxon';
import 'chartjs-plugin-datalabels';

import ChartStreaming from 'chartjs-plugin-streaming';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute } from '@angular/router';
import { IGetEventDevicePositionResponse, IPosition } from '@event-participation-trends/api/event/util';
import { set } from 'mongoose';
import { Select, Store } from '@ngxs/store';
import { EventScreenViewState } from '@event-participation-trends/app/eventscreenview/data-access';
import { Observable } from 'rxjs';

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
  @Select(EventScreenViewState.currentTime) currentTime$!: Observable<string>;

  @ViewChild('heatmapContainer') heatmapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('totalUserCountChart') totalUserCountChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('totalDeviceCountChart') totalDeviceCountChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('userCountDataStreamingChart') userCountDataStreamingChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('flowmapContainer') flowmapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('totalDevicesBarChart') totalDevicesBarChart!: ElementRef<HTMLCanvasElement>;

  isLoading = true;
  activeDevices = 25;
  inactiveDevices = 5;
  diviceCountChart = null;
  showToggle = false;
  showHeatmap = false;
  showFlowmap = false;
  myHeatmap: any;
  myHeatLayer: any;
  myFlowmapLayer: any;
  oldHeatmapData: (L.LatLng | L.HeatLatLngTuple)[] = [];
  gridTilesDataPoints: {gridTile: HTMLDivElement, datapoints: IAverageDataFound[]}[] = [];
  hotzoneMarker: any;
  streamingUserCountChart: Chart | null = null;

  averageDataFound: {
    id: number | null | undefined,
    latLng: {
      oldDataPoint: L.LatLng | L.HeatLatLngTuple,
      newDataPoint: L.LatLng | L.HeatLatLngTuple
    },
    detectedThisRun: boolean
  }[] = [];
  eventId = null;
  totalUsersDetected = 0;
  averageDataDetectedThisRun: IAverageDataFound[] = [];

  //testing data points with real data using time variables below
  // startTime = new Date(2023, 6, 20, 8, 42, 14).toString().replace(/( [A-Z]{3,4})$/, '').slice(0, 33);
  // endTime = new Date(2023, 6, 20, 8, 42, 19).toString().replace(/( [A-Z]{3,4})$/, '').slice(0, 33);
  // Lukas Se Kamer Event times  
  startTime = new Date(2023, 6, 26, 6, 52, 0).toString().replace(/( [A-Z]{3,4})$/, '').slice(0, 33);
  endTime = new Date(2023, 6, 26, 6, 53, 5).toString().replace(/( [A-Z]{3,4})$/, '').slice(0, 33);

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

    if (this.eventId) this.appApiService.getFloorplanBoundaries(this.eventId).then((response) => {
      if (response.boundaries) {
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

    // this.store.dispatch()
  }

  ngAfterViewInit() {
    // wait until the heatmap container is rendered
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    
    setTimeout(() => {

      Chart.register(ChartStreaming);
      this.renderHeatMap();
      this.renderTotalUserCount();
      this.renderTotalDeviceCount();
      this.renderUserCountDataStreaming();
      this.renderTotalDevicesBarChart();
    }, 1000);

    // const eventSource = new EventSource();

    // eventSource.onmessage = (event) => {
    //   // Handle incoming data from the server
    //   const eventData = JSON.parse(event.data);
    //   // Process the eventData as needed
    //   console.log(eventData);
    // };

    // eventSource.onerror = (error) => {
    //   // Handle errors in the SSE connection
    //   console.error('SSE Error:', error);
    //   eventSource.close();
    // };

    // eventSource.onopen = () => {
    //   // The SSE connection is established
    //   console.log('SSE Connection Open');
    // };

    setInterval(() => {
      // const heatmapData: (L.LatLng | L.HeatLatLngTuple)[] = this.generateHeatmapData(); // for testing purposes
      this.getAverageData();
      // this.averageDataFound = this.generateRandomData(100);
      
      // remove all data points that were not detected this run
      this.averageDataDetectedThisRun = this.averageDataFound.filter((averageDataPoint: IAverageDataFound) => averageDataPoint.detectedThisRun); 
      this.totalUsersDetected = this.averageDataDetectedThisRun.length;
      
      const newData = this.totalUsersDetected;
      const newTime = new Date(this.startTime).toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });

      // add new label and data to the chart
      this.streamingUserCountChart?.data.labels?.push(newTime);
      // add new data to the chart
      this.streamingUserCountChart?.data.datasets[0].data?.push(newData);
      this.streamingUserCountChart?.update();

      // convert averageDataDetectedThisRun to heatmap data using the new data points
      const heatmapData: (L.LatLng | L.HeatLatLngTuple)[] = this.averageDataDetectedThisRun.map((averageDataPoint: IAverageDataFound) => averageDataPoint.latLng.newDataPoint);

      if (this.showHeatmap) {
        this.myHeatLayer.setLatLngs(heatmapData);

        // If we have the data we can determine the hotzone of the heatmap and add a red circle radius Marker to it
        // determine hot zone and add a red circle radius Marker to it
        // const hotZone = this.getHotZone(heatmapData);
        // this.hotzoneMarker.setLatLng(hotZone);
      }

      if (this.showFlowmap) {
        // clear the gridTilesDataPoints array
        this.gridTilesDataPoints = [];

        // add arrow icons to every grid tile on the flowmap layer
        this.addIconsToGridTiles(this.averageDataDetectedThisRun);

        //remove all grid tiles if there are no data
        if (this.averageDataDetectedThisRun.length === 0) {
          this.removeArrowIconsFromGridTiles();
        }
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

  // Function to generate a random number within a given range
  randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Function to generate a random movement direction (up, down, left, right, diagonal)
  randomMovementDirection(): number[] {
    const directions = [
      [0, 1],   // Up
      [0, -1],  // Down
      [1, 0],   // Right
      [-1, 0],  // Left
      [1, 1],   // Diagonal Up-Right
      [1, -1],  // Diagonal Up-Left
      [-1, 1],  // Diagonal Down-Right
      [-1, -1], // Diagonal Down-Left
    ];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
  }

  // Function to generate random data points
  generateRandomDataPoint(id: number): IAverageDataFound {
    const xMin = 15;
    const xMax = 1040;
    const yMin = 60;
    const yMax = 450;
    const movementAmount = 0.6; // Adjust this value to control the magnitude of movement

    const xOld = this.randomInRange(xMin, xMax);
    const yOld = this.randomInRange(yMin, yMax);
    const [dx, dy] = this.randomMovementDirection();
    let xNew = xOld + dx * movementAmount;
    let yNew = yOld + dy * movementAmount;
  
    // Ensure the new data point stays within the specified bounds
    xNew = Math.max(xMin, Math.min(xMax, xNew));
    yNew = Math.max(yMin, Math.min(yMax, yNew));

    // convert x and y coordinates to lat and lng coordinates
    const latLngOld = this.myHeatmap.containerPointToLatLng(L.point(xOld, yOld));
    const latLngNew = this.myHeatmap.containerPointToLatLng(L.point(xNew, yNew));

    const dataPoint: IAverageDataFound = {
      id: id,
      latLng: {
        oldDataPoint: latLngOld,
        newDataPoint: latLngNew,
      },
      detectedThisRun: Math.random() < 0.5, // Random boolean
    };

    return dataPoint;
  }

  // Function to generate an array of random data points
  generateRandomData(numPoints: number): IAverageDataFound[] {
    const dataPoints: IAverageDataFound[] = [];
    for (let i = 0; i < numPoints; i++) {
      dataPoints.push(this.generateRandomDataPoint(i));
    }
    return dataPoints;
  }


  getAverageData() {
    // extract event id from url
    const eventId = this.eventId;  
    // increase start time and end time variables by 5 seconds
    this.startTime = this.endTime;
    const newStartTime = new Date(this.startTime);
    // increase end time by 5 seconds and determine if any other time measure needs to increase if the new time is greater than 60
    const newEndTime = new Date(this.endTime);
    newEndTime.setSeconds(newEndTime.getSeconds() + 5);
    this.endTime = newEndTime.toString().replace(/( [A-Z]{3,4})$/, '');

    const response = this.appApiService.getEventDevicePosition(eventId, newStartTime, newEndTime);

    response.then((data: IGetEventDevicePositionResponse | null | undefined) => {
      if (data?.positions) {
        this.averageDataFound = this.updateHeatmapData(data.positions);

        //log the x and y coordinates of the average data points
        // data.positions.forEach((position: IPosition) => {
        //   console.log(`averageX: ${position.x}, averageY: ${position.y}`);
        // });
      }
    });
  }

  updateHeatmapData(positions: IPosition[]) {
    if (this.averageDataFound.length === 0) {
      positions.forEach((position: IPosition) => {
        const latLng = this.calculateAverageXandY(positions, position);

        // convert x and y coordinates to lat and lng coordinates
        // const latLng = L.latLng(this.convertXYToLatLng(averageX, averageY));
        // add new average data point to the averageDataFound array
        this.averageDataFound.push({
          id: position.id, 
          latLng: {
          oldDataPoint: latLng,
          newDataPoint: latLng
          },
          detectedThisRun: true
        });
      });
      return this.averageDataFound;

    } else {
      // set all detectedThisRun properties of the average data points to false
      this.averageDataFound.forEach((averageDataPoint: IAverageDataFound) => {
        averageDataPoint.detectedThisRun = false;
      });

      //determine new/old positions detected this run
      positions.forEach((position: IPosition) => {
        const latLng = this.calculateAverageXandY(positions, position);

        // convert x and y coordinates to lat and lng coordinates
        // const latLng = this.myHeatmap.containerPointToLatLng(L.point(averageX, averageY));

        // determine if there already exists an average data point with the same id
        const existingPoint = this.averageDataFound.find((averageDataPoint: IAverageDataFound) => {
          if (averageDataPoint.id === position.id) {
            // update the old data point of the average data point
            averageDataPoint.latLng.oldDataPoint = averageDataPoint.latLng.newDataPoint;
            // update the new data point of the average data point
            averageDataPoint.latLng.newDataPoint = latLng;

            // set detectedThisRun property to true
            averageDataPoint.detectedThisRun = true;
          }

          return averageDataPoint.id === position.id;
        });

        // if there is no existing average data point with the same id, add a new one
        if (!existingPoint) {
          this.averageDataFound.push({
            id: position.id,
            latLng: {
              oldDataPoint: latLng,
              newDataPoint: latLng
            },
            detectedThisRun: true
          });
        }
      });

      return this.averageDataFound;
    }
  }

  calculateAverageXandY(positions: IPosition[], position: IPosition): L.LatLng {
    // retrieve all data postions with the same id
    const positionsWithSameId = positions.filter((pos: IPosition) => pos.id === position.id);

    // // calculate average x and y coordinates of all data positions with the same id
    // const averageX = positionsWithSameId.reduce((acc: number, curr: IPosition) => {
    //   if (curr.x) {
    //     return acc + curr.x;
    //   } else {
    //     return acc;
    //   }
    // }, 0) / positionsWithSameId.length;

    // const averageY = positionsWithSameId.reduce((acc: number, curr: IPosition) => {
    //   if (curr.y) {
    //     return acc + curr.y;
    //   } else {
    //     return acc;
    //   }
    // }, 0) / positionsWithSameId.length;

    const positionsWithSameId_LatLng: L.LatLng[] = [];
    positionsWithSameId.map((pos: IPosition) => {
      if (pos.x != null && pos.y != null) {
        let latLng = L.latLng(this.convertXYToLatLng(pos.x, pos.y));
        latLng = L.latLng(latLng);
        positionsWithSameId_LatLng.push(latLng);
      }
    });

    const averageX = positionsWithSameId_LatLng.reduce((acc: number, curr: {lat: number, lng: number}) => {
      if (curr.lng) {
        return acc + curr.lng;
      } else {
        return acc;
      }
    }, 0) / positionsWithSameId_LatLng.length;

    const averageY = positionsWithSameId_LatLng.reduce((acc: number, curr: {lat: number, lng: number}) => {
      if (curr.lat) {
        return acc + curr.lat;
      } else {
        return acc;
      }
    }, 0) / positionsWithSameId_LatLng.length;

    return L.latLng(averageX, averageY);
  }

  showToggleButton() {
    this.showToggle = true;
  }

  hideToggleButton() {
    this.showToggle = false;
  }

  toggleFlowmap() {
    this.showFlowmap = !this.showFlowmap;

    if (this.showFlowmap) {
      // add arrow icons to every grid tile on the flowmap layer
      this.addIconsToGridTiles();
    } else {      
      // remove arrow icons from all gridtiles that have them
      this.removeArrowIconsFromGridTiles();
    }
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

  addIconsToGridTiles(averageDataThisRun: IAverageDataFound[] = []) {
    const gridTiles = this.myFlowmapLayer.getContainer().children.item(0).children;

    for (let i = 0; i < gridTiles.length; i++) {
      const gridTile = gridTiles.item(i);
      let hasDatapoints = false;
      //return all the data points within the grid tile using old heatmap data
      const gridTileDataPoints = this.getAllDataPointsWithinGridTile(averageDataThisRun, gridTile);
      // if (gridTileDataPoints.length > 0) {
      //   this.gridTilesDataPoints.push({gridTile: gridTile, datapoints: gridTileDataPoints});
      // }
      if (gridTileDataPoints.length > 0) {
        hasDatapoints = true;
      }
      
      // check if the datapoint is already added to the gridTilesDataPoints array
      const existingGridTileDataPoints = this.gridTilesDataPoints.find((gridTileDataPoint: {gridTile: HTMLDivElement, datapoints: IAverageDataFound[]}) => gridTileDataPoint.gridTile === gridTile);

      // if there is no existing grid tile data points, add it to the gridTilesDataPoints array
      if (!existingGridTileDataPoints) {
        this.gridTilesDataPoints.push({gridTile: gridTile, datapoints: gridTileDataPoints});
      } else {
        // if there is an existing grid tile data points, update the datapoints array
        existingGridTileDataPoints.datapoints = gridTileDataPoints;
      }

      // get average moving direction of all data points within the grid tile
      const averageMovingDirection = this.getAverageMovingDirection(gridTileDataPoints);

      const childIcon = gridTile.children.item(0);

      this.addIconToGridTile(gridTile, averageMovingDirection, childIcon, hasDatapoints);
    }
    
    // add an arrow icon to each grid tile that has data points within it
    // this.gridTilesDataPoints.forEach((pointWithData: {gridTile: HTMLDivElement, datapoints: (L.LatLng | L.HeatLatLngTuple)[]}) => {
    //   this.addIconToGridTile(pointWithData.gridTile, this.getAverageMovingDirection(pointWithData.datapoints));
    // });
  }

  getAverageMovingDirection(dataPoints: IAverageDataFound[]) {
    let movingAngle = 0;
    let totalMovingDirectionForward = 0;
    let totalMovingDirectionRight = 0;

    dataPoints.forEach((dataPoint: IAverageDataFound) => {
      const oldDataPoint = dataPoint.latLng.oldDataPoint;
      const newDataPoint = dataPoint.latLng.newDataPoint;

      const oldDataPointCenter = this.myHeatmap.latLngToContainerPoint(oldDataPoint);
      const newDataPointCenter = this.myHeatmap.latLngToContainerPoint(newDataPoint);

      const oldDataPointCenterX = oldDataPointCenter.x / this.gridTileSize;
      const oldDataPointCenterY = oldDataPointCenter.y / this.gridTileSize;
      const newDataPointCenterX = newDataPointCenter.x / this.gridTileSize;
      const newDataPointCenterY = newDataPointCenter.y / this.gridTileSize;

      const movingDirectionForward = newDataPointCenterY - oldDataPointCenterY;
      const movingDirectionRight = newDataPointCenterX - oldDataPointCenterX;

      totalMovingDirectionForward += movingDirectionForward;
      totalMovingDirectionRight += movingDirectionRight;
    });

    movingAngle = Math.atan2(totalMovingDirectionForward, totalMovingDirectionRight) * 180 / Math.PI;

    movingAngle = movingAngle < 0 ? 360 + movingAngle : movingAngle;
    
    return movingAngle;
  } 

  getAllDataPointsWithinGridTile(averageDataThisRun: IAverageDataFound[], gridTile: HTMLDivElement) {
    const datapoints: IAverageDataFound[] = [];
    const gridTileBounds = gridTile.getBoundingClientRect();
    const gridTileCenter = {
      x: gridTileBounds.left + gridTileBounds.width / 2,
      y: gridTileBounds.top + gridTileBounds.height / 2
    };

    // this.oldHeatmapData.forEach((dataPoint: (L.LatLng | L.HeatLatLngTuple)) => {
    //   if ('lat' in dataPoint && 'lng' in dataPoint) {
    //     // It's an L.LatLng type
    //     const latLngDataPoint = dataPoint as L.LatLng;
    //     let dataPointCenter = this.myHeatmap.latLngToContainerPoint(latLngDataPoint);
    //     dataPointCenter = {
    //       x: dataPointCenter.x / this.gridTileSize,
    //       y: dataPointCenter.y / this.gridTileSize
    //     }
    //     if (this.isPointWithinGridTile(dataPointCenter, gridTileCenter, gridTileBounds)) {
    //       datapoints.push(dataPoint);
    //     }
    //   }
    //   else {
    //     // It's a HeatLatLngTuple type
    //     const heatLatLngDataPoint = dataPoint as L.HeatLatLngTuple;
    //     let dataPointCenter = this.myHeatmap.latLngToContainerPoint(L.latLng(heatLatLngDataPoint[0], heatLatLngDataPoint[1]));
    //     dataPointCenter = {
    //       x: dataPointCenter.x / this.gridTileSize,
    //       y: dataPointCenter.y / this.gridTileSize
    //     }
    //     if (this.isPointWithinGridTile(dataPointCenter, gridTileCenter, gridTileBounds)) {
    //       datapoints.push(dataPoint);
    //     }
    //   }
    // });
    
    averageDataThisRun.forEach((dataPoint: IAverageDataFound) => {
      const dataPointCenter = this.myHeatmap.latLngToContainerPoint(dataPoint.latLng.newDataPoint);
      
      dataPointCenter.x = dataPointCenter.x / this.gridTileSize;
      dataPointCenter.y = dataPointCenter.y / this.gridTileSize;

      if (this.isPointWithinGridTile(dataPointCenter, gridTileCenter, gridTileBounds)) {
        datapoints.push(dataPoint);
      }
    });

    return datapoints;
  }

  isPointWithinGridTile(dataPointCenter: any, gridTileCenter: any, gridTileBounds: any) {
    const distance = Math.sqrt(Math.pow(dataPointCenter.x - (gridTileCenter.x / this.gridTileSize), 2) + Math.pow(dataPointCenter.y - (gridTileCenter.y / this.gridTileSize), 2));
    const radius = this.detectionRadius;
 
    return distance < radius;
  }

  addIconToGridTile(gridTile: HTMLDivElement, rotation: number, icon: HTMLIonIconElement | null | undefined, hasDataPoints: boolean) {
    if (!icon) {
      const arrowIcon = document.createElement('ion-icon');
      arrowIcon.setAttribute('name', 'arrow-up-outline');
      arrowIcon.style.fontSize = '20px';
      arrowIcon.style.color = 'rgba(255, 0, 255, 1)';
      arrowIcon.style.position = 'absolute';
      arrowIcon.style.top = '50%';
      arrowIcon.style.left = '50%';
      arrowIcon.style.transform = 'translate(-50%, -50%)';
      //first transform to default rotation
      arrowIcon.style.transform = ' rotate(0deg)';
      if (rotation) {
        arrowIcon.style.transform += ` rotate(${rotation}deg)`;
      }
      gridTile.appendChild(arrowIcon);
    }
    else {
      icon.style.transform = 'translate(-50%, -50%)';
      //first transform to default rotation
      icon.style.transform += ' rotate(0deg)';
      if (rotation) {
        icon.style.transform += ` rotate(${rotation}deg)`;
      }
    }
    // if (hasDataPoints && !icon) {
    //   const arrowIcon = document.createElement('ion-icon');
    //   arrowIcon.setAttribute('name', 'arrow-up-outline');
    //   arrowIcon.style.fontWeight = 'bold';
    //   arrowIcon.style.fontSize = '20px';
    //   arrowIcon.style.color = 'rgba(255, 0, 0, 1)';
    //   arrowIcon.style.position = 'absolute';
    //   arrowIcon.style.top = '50%';
    //   arrowIcon.style.left = '50%';
    //   arrowIcon.style.transform = 'translate(-50%, -50%)';
    //   //first transform to default rotation
    //   arrowIcon.style.transform = ' rotate(0deg)';
    //   if (rotation) {
    //     arrowIcon.style.transform += ` rotate(${rotation}deg)`;
    //   }
    //   gridTile.appendChild(arrowIcon);
    // } else if (hasDataPoints && icon) {
    //   icon.style.transform = 'translate(-50%, -50%)';
    //   //first transform to default rotation
    //   icon.style.transform += ' rotate(0deg)';
    //   if (rotation) {
    //     icon.style.transform += ` rotate(${rotation}deg)`;
    //   }
    // }
    // else if (!hasDataPoints && icon) {
    //   // add red dot icon
    //   icon.setAttribute('name', 'ellipse');
    //   icon.style.fontWeight = 'bold';
    //   icon.style.fontSize = '6px';
    //   icon.style.color = 'rgba(255, 255, 0, 1)';
    //   icon.style.transform = 'translate(-50%, -50%)';
    //   //first transform to default rotation
    //   icon.style.transform += ' rotate(0deg)';
    // }
  }

  toggleHeatmap() {
    this.showHeatmap = !this.showHeatmap;

    if (this.showHeatmap) {
      // const heatmapData: (L.LatLng | L.HeatLatLngTuple)[] = this.oldHeatmapData.length > 0 ? this.oldHeatmapData : this.generateHeatmapData();

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

  renderHeatMap() {
    this.myHeatmap = L.map(this.heatmapContainer.nativeElement).setView(this.mapCenter, this.mapZoomLevel);

    //disable zoom functionality
    this.myHeatmap.touchZoom.disable();
    this.myHeatmap.doubleClickZoom.disable();
    this.myHeatmap.scrollWheelZoom.disable();
    this.myHeatmap.boxZoom.disable();
    this.myHeatmap.keyboard.disable();
    this.myHeatmap.dragging.disable();

    // disable zoom in and out buttons
    this.myHeatmap.removeControl(this.myHeatmap.zoomControl);
    this.myHeatmap.removeControl(this.myHeatmap.attributionControl);

    const imageUrl = 'assets/LukasSeKamerEvent.jpeg';
    // const imageBounds: L.LatLngBounds = this.myHeatmap.getBounds();
    // get bounds of heatmap container
    const imageBounds: L.LatLngBounds = L.latLngBounds(
      this.myHeatmap.containerPointToLatLng(L.point(0, 0)),
      this.myHeatmap.containerPointToLatLng(L.point(this.heatmapContainer.nativeElement.offsetWidth, this.heatmapContainer.nativeElement.offsetHeight))
    );
    L.imageOverlay(imageUrl, imageBounds, {zIndex: 0}).addTo(this.myHeatmap);

    const myGrid = L.GridLayer.extend({
      options: {
        tileSize: this.gridTileSize,
        opacity: 0.9,
        zIndex: 1000,
        bounds: imageBounds,
      },
      // Override _tileCoordsToBounds function
      _tileCoordsToBounds: function (coords: any) {
        const tileSize = this.getTileSize();
        const nwPoint = coords.scaleBy(tileSize);
        const sePoint = nwPoint.add(tileSize);
        const nw = this._map.unproject(nwPoint, coords.z);
        const se = this._map.unproject(sePoint, coords.z);
        return L.latLngBounds(nw, se);
      },
      // By default, the container for a whole zoom level worth of visible tiles
      // has a "pointer-events: none" CSS property. Override this whenever a new
      // level container is created. This is needed for pointer (mouse) interaction.
      _onCreateLevel: function(level: any) {
        level.el.style.pointerEvents = 'inherit';
      },
      createTile: (coords: any) => {
        const tile = L.DomUtil.create('div', 'grid-tile');
        // tile.style.background = 'rgba(209 213 219, 0.4)';
        tile.style.background = 'rgba(0, 0, 0, 0.1)';
        tile.style.border = 'solid 1px rgba(0, 0, 0, 0.2)';
        tile.style.fontSize = '10px';
        tile.style.color = 'rgba(0, 0, 0, 0.5)';
        tile.style.textAlign = 'center';

        return tile;
      }
    });

    this.myFlowmapLayer = new myGrid();

    this.myFlowmapLayer.addTo(this.myHeatmap);

    // functionality to log the coordinates of the mouse pointer on the heatmap container
    // this.myHeatmap.addEventListener('mousemove', (event: any) => {
    //   const latLng = this.myHeatmap.mouseEventToLatLng(event.originalEvent);
    //   console.log(latLng);
    //   console.log('X,Y: ' + event.originalEvent.clientX + ', ' + event.originalEvent.clientY);
    // });

    // this.hotzoneMarker = L.circleMarker([0, 0], {
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5,
    //   radius: 10
    // }).addTo(this.myHeatmap);
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
    // return the point 0, 0
    // return [L.latLng(0, 0)];
    /*
      Note: Most of the funtionality in this method is used for testing purposes only.
      Once we have real data we can remove the testing code and replace it with the real data.
    */

    const heatmapData: (L.LatLng | L.HeatLatLngTuple)[] = [];
    // const bounds = {
    //   north: 0.031,   // Latitude of the north boundary
    //   south: -0.0315,   // Latitude of the south boundary
    //   east: 0.123,   // Longitude of the east boundary
    //   west: -0.1235    // Longitude of the west boundary
    // };
  
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
    const data = {
      datasets: [{
        label: 'Users',
        data: [],
        backgroundColor: [
          '#0000FF',
        ],
        borderColor: [
          '#0000FF',
        ],
        color: [
          '#FFFFFF',
        ]
      }]
    };

    // set the format of the start time of the event to be displayed on the x-axis in the format of 'HH:mm:ss'
    const startOfEvent = new Date(this.startTime).toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });

    const config: ChartConfiguration = {
      type: 'line',             // 'line', 'bar', 'bubble' and 'scatter' types are supported
      data: {
        labels: [startOfEvent],             // empty at the beginning
        datasets: [{
          data: [0],              // empty at the beginning
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
            text: 'Users Detected'
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
    const data = {
        labels: ['08:00', '09:00', '10:00', '10:00', '11:00'],
        datasets: [{
          data: [10, 20, 15, 25, 30],
          backgroundColor: [
            'rgb(34 197 94)',
            '#FF0000',
          ],
          borderColor: [
            'rgb(34 197 94)',
            '#FF0000',
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
                              text: 'Active Devices vs Time of day', 
                            },
                            legend:{
                                display: false
                            },
                            tooltip: {
                                enabled: false
                            },
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
                                  text: 'Number of Active Devices', 
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
