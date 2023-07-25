import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import 'luxon';
import 'chartjs-adapter-luxon';
import 'chartjs-plugin-datalabels';

import ChartStreaming from 'chartjs-plugin-streaming';


@Component({
  selector: 'event-participation-trends-eventscreenview',
  templateUrl: './eventscreenview.page.html',
  styleUrls: ['./eventscreenview.page.css'],
})
export class EventScreenViewPage {
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
  gridTilesDataPoints: {gridTile: HTMLDivElement, datapoints: (L.LatLng | L.HeatLatLngTuple)[]}[] = [];
  
  /**
   * The variables within the below block are used to determine the corrdinates of the
   * grid tiles on the flowmap layer. The grid tiles are used to determine the direction
   * of the arrows on the flowmap layer.
   * 
   * If you change the values of them, your grid map and heatmap will not work correctly.
   */
  // ====================================
  gridTileSize = 28.05;
  mapZoomLevel = 1;

  // center the map on the heatmap container such that the coordinates of the center point of the map is (0, 0)
  mapCenter = L.latLng(0, 0);
  
  // set the bounds for the heatmap data points to be generated within (in x and y)
  heatmapBounds : {
    north: number,   // Latitude of the north boundary
    south: number,   // Latitude of the south boundary
    east: number,   // Longitude of the east boundary
    west: number    // Longitude of the west boundary
  } = {
    north: 80,
    south: -80,
    east: 307,
    west: -307 
  };

  detectionRadius = 3;
  // ====================================

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

    
    setInterval(() => {
      const heatmapData: (L.LatLng | L.HeatLatLngTuple)[] = this.generateHeatmapData();
      if (this.showHeatmap) {
          this.myHeatLayer.setLatLngs(heatmapData);
        }

      if (this.showFlowmap) {
        // remove arrow icons from all gridtiles that have them
        this.removeArrowIconsFromGridTiles();

        // clear the gridTilesDataPoints array
        this.gridTilesDataPoints = [];

        // add arrow icons to every grid tile on the flowmap layer
        this.addArrowIconsToGridTiles(heatmapData);
      }
    }, 500);
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
      this.addArrowIconsToGridTiles();
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

  addArrowIconsToGridTiles(data: (L.LatLng | L.HeatLatLngTuple)[] = this.oldHeatmapData) {
    const gridTiles = this.myFlowmapLayer.getContainer().children.item(0).children;

    for (let i = 0; i < gridTiles.length; i++) {
      const gridTile = gridTiles.item(i);
      
      //return all the data points within the grid tile using old heatmap data
      const gridTileDataPoints = this.getAllDataPointsWithinGridTile(data, gridTile);
      // if (gridTileDataPoints.length > 0) {
      //   this.gridTilesDataPoints.push({gridTile: gridTile, datapoints: gridTileDataPoints});
      // }
      this.gridTilesDataPoints.push({gridTile: gridTile, datapoints: gridTileDataPoints});

      // get average moving direction of all data points within the grid tile
      const averageMovingDirection = this.getAverageMovingDirection(gridTileDataPoints);

      this.addArrowIconToGridTile(gridTile, averageMovingDirection);
    }
    
    // add an arrow icon to each grid tile that has data points within it
    // this.gridTilesDataPoints.forEach((pointWithData: {gridTile: HTMLDivElement, datapoints: (L.LatLng | L.HeatLatLngTuple)[]}) => {
    //   this.addArrowIconToGridTile(pointWithData.gridTile, this.getAverageMovingDirection(pointWithData.datapoints));
    // });
  }

  getAverageMovingDirection(dataPoints: (L.LatLng | L.HeatLatLngTuple)[]) {
    let movingAngle = 0;
    let totalMovingDirectionForward = 0;
    let totalMovingDirectionRight = 0;

    dataPoints.forEach((dataPoint: (L.LatLng | L.HeatLatLngTuple)) => {
      if ('lat' in dataPoint && 'lng' in dataPoint) {
        // It's an L.LatLng type
        const latLngDataPoint = dataPoint as L.LatLng;
        totalMovingDirectionForward += latLngDataPoint.lat;
        totalMovingDirectionRight += latLngDataPoint.lng;
      }
      else {
        // It's a HeatLatLngTuple type
        const heatLatLngDataPoint = dataPoint as L.HeatLatLngTuple;
        totalMovingDirectionForward += heatLatLngDataPoint[0];
        totalMovingDirectionRight += heatLatLngDataPoint[1];
      }
    });

    movingAngle = Math.atan2(totalMovingDirectionForward, totalMovingDirectionRight) * 180 / Math.PI;

    movingAngle = movingAngle < 0 ? 360 + movingAngle : movingAngle;
    
    return movingAngle;
  } 

  getAllDataPointsWithinGridTile(dataPoints: (L.LatLng | L.HeatLatLngTuple)[], gridTile: HTMLDivElement) {
    const datapoints: any[] = [];
    const gridTileBounds = gridTile.getBoundingClientRect();
    const gridTileCenter = {
      x: gridTileBounds.left + gridTileBounds.width / 2,
      y: gridTileBounds.top + gridTileBounds.height / 2
    };

    this.oldHeatmapData.forEach((dataPoint: (L.LatLng | L.HeatLatLngTuple)) => {
      if ('lat' in dataPoint && 'lng' in dataPoint) {
        // It's an L.LatLng type
        const latLngDataPoint = dataPoint as L.LatLng;
        let dataPointCenter = this.myHeatmap.latLngToContainerPoint(latLngDataPoint);
        dataPointCenter = {
          x: dataPointCenter.x / this.gridTileSize,
          y: dataPointCenter.y / this.gridTileSize
        }
        if (this.isPointWithinGridTile(dataPointCenter, gridTileCenter, gridTileBounds)) {
          datapoints.push(dataPoint);
        }
      }
      else {
        // It's a HeatLatLngTuple type
        const heatLatLngDataPoint = dataPoint as L.HeatLatLngTuple;
        let dataPointCenter = this.myHeatmap.latLngToContainerPoint(L.latLng(heatLatLngDataPoint[0], heatLatLngDataPoint[1]));
        dataPointCenter = {
          x: dataPointCenter.x / this.gridTileSize,
          y: dataPointCenter.y / this.gridTileSize
        }
        if (this.isPointWithinGridTile(dataPointCenter, gridTileCenter, gridTileBounds)) {
          datapoints.push(dataPoint);
        }
      }
    });
    return datapoints;
  }

  isPointWithinGridTile(dataPointCenter: any, gridTileCenter: any, gridTileBounds: any) {
    const distance = Math.sqrt(Math.pow(dataPointCenter.x - (gridTileCenter.x / this.gridTileSize), 2) + Math.pow(dataPointCenter.y - (gridTileCenter.y / this.gridTileSize), 2));
    const radius = this.detectionRadius;
 
    return distance < radius;
  }

  addArrowIconToGridTile(gridTile: any, rotation: number) {
    const arrowIcon = document.createElement('ion-icon');
    arrowIcon.setAttribute('name', 'arrow-up-outline');
    arrowIcon.style.fontSize = '20px';
    arrowIcon.style.color = 'rgba(255, 0, 0, 1)';
    arrowIcon.style.position = 'absolute';
    arrowIcon.style.top = '50%';
    arrowIcon.style.left = '50%';
    arrowIcon.style.transform = 'translate(-50%, -50%)';
    //first transform to default rotation
    arrowIcon.style.transform += ' rotate(0deg)';
    arrowIcon.style.transform += ` rotate(${rotation}deg)`;
    gridTile.appendChild(arrowIcon);
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
  
      // If we have the data we can determine the hotzone of the heatmap and add a red circle radius Marker to it
      // determine hot zone and add a red circle radius Marker to it
      // const hotZone = this.getHotZone(heatmapData);
      // L.circleMarker(hotZone, { radius: 40, color: 'red', fillColor: 'red', fillOpacity: 0.45 }).addTo(map);
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
    // this.myHeatmap.dragging.disable();

    // disable zoom in and out buttons
    this.myHeatmap.removeControl(this.myHeatmap.zoomControl);
    this.myHeatmap.removeControl(this.myHeatmap.attributionControl);


    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: 'Map data &copy; OpenStreetMap contributors',
    //   maxZoom: 18
    // }).addTo(map);

    const imageUrl = 'assets/stage (3).png';
    // const imageBounds: L.LatLngBounds = map.getBounds();
    // get bounds of heatmap container
    const imageBounds: L.LatLngBounds = L.latLngBounds(
      this.myHeatmap.containerPointToLatLng(L.point(0, 0)),
      this.myHeatmap.containerPointToLatLng(L.point(this.heatmapContainer.nativeElement.offsetWidth, this.heatmapContainer.nativeElement.offsetHeight))
    );
    L.imageOverlay(imageUrl, imageBounds, {zIndex: 0}).addTo(this.myHeatmap);

    //set the heatmapData bounds
    this.heatmapBounds = {
      north: imageBounds.getNorth(),   // Latitude of the north boundary
      south: imageBounds.getSouth(),   // Latitude of the south boundary
      east: imageBounds.getEast(),   // Longitude of the east boundary
      west: imageBounds.getWest()    // Longitude of the west boundary
    };

    const myGrid = L.GridLayer.extend({
      options: {
        tileSize: this.gridTileSize,
        opacity: 0.9,
        zIndex: 1000,
        bounds: L.latLngBounds(
          this.myHeatmap.containerPointToLatLng(L.point(0, 0)),
          this.myHeatmap.containerPointToLatLng(L.point(this.heatmapContainer.nativeElement.offsetWidth, this.heatmapContainer.nativeElement.offsetHeight))         
        ),
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

    // // functionality to log the coordinates of the mouse pointer on the heatmap container
    // this.myHeatmap.addEventListener('mousemove', (event: any) => {
    //   const latLng = this.myHeatmap.mouseEventToLatLng(event.originalEvent);
    //   console.log(latLng);
    //   console.log('X,Y: ' + event.originalEvent.clientX + ', ' + event.originalEvent.clientY);
    // });
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
        const latitude = 0 + Math.random() * (this.heatmapBounds.north + this.heatmapBounds.south);
        const longitude = 0 + Math.random() * (this.heatmapBounds.east + this.heatmapBounds.west);
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
        latLngDataPoint.lat = Math.max(this.heatmapBounds.south, Math.min(this.heatmapBounds.north, latLngDataPoint.lat)); // Latitude
        latLngDataPoint.lng = Math.max(this.heatmapBounds.west, Math.min(this.heatmapBounds.east, latLngDataPoint.lng)); // Longitude
      } else {
        // It's a HeatLatLngTuple type
        const heatLatLngDataPoint = dataPoint as L.HeatLatLngTuple;
    
        const latDisplacement = getRandomNumber(-maxDisplacement, maxDisplacement);
        const lngDisplacement = getRandomNumber(-maxDisplacement, maxDisplacement);
    
        heatLatLngDataPoint[0] += latDisplacement; // Latitude
        heatLatLngDataPoint[1] += lngDisplacement; // Longitude
    
        // Make sure the updated data point stays within the defined bounds
        heatLatLngDataPoint[0] = Math.max(this.heatmapBounds.south, Math.min(this.heatmapBounds.north, heatLatLngDataPoint[0])); // Latitude
        heatLatLngDataPoint[1] = Math.max(this.heatmapBounds.west, Math.min(this.heatmapBounds.east, heatLatLngDataPoint[1])); // Longitude
      }
    });

    heatmapData.push(...this.oldHeatmapData);
  
    return heatmapData;
  }

  renderTotalUserCount() {
    const data = {
      datasets: [{
        label: 'Total Users',
        data: [100],
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

    const config: ChartConfiguration = {
      type: 'line',             // 'line', 'bar', 'bubble' and 'scatter' types are supported
      data: {
        labels: [''],             // empty at the beginning
        datasets: [{
          label: 'Users',
          data: [0],              // empty at the beginning
        }]
      },
      options: {
        scales: {
          x: {
            type: 'realtime',   // x axis will auto-scroll from right to left
            realtime: {         // per-axis options
              duration: 20000,  // data in the past 20000 ms will be displayed
              refresh: 2000,    // onRefresh callback will be called every 1000 ms
              delay: 1000,      // delay of 1000 ms, so upcoming values are known before plotting a line
    
              // a callback to update datasets
              onRefresh: chart => {
    
                // // query your data source and get the array of {x: timestamp, y: value} objects
                // let data = getLatestData();
    
                // // append the new data array to the existing chart data
                // chart.data.datasets[0].data.push(...data);

                chart.config.data.datasets.forEach((dataset: any) => {
                  dataset.data.push({
                    x: Date.now(),
                    y: Math.random()
                  });
                });

                chart.update();
              }
            }
          }
        }
      }
    };

    const userCountDataStreamingCanvas = this.userCountDataStreamingChart.nativeElement;

    if (userCountDataStreamingCanvas) {
      const userCountDataStreamingCtx = userCountDataStreamingCanvas.getContext('2d', { willReadFrequently: true });
      if (userCountDataStreamingCtx) {
        const myChart = new Chart(
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
