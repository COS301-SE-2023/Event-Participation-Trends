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

  isLoading = true;
  activeDevices = 25;
  inactiveDevices = 5;
  diviceCountChart = null;
  heatmap: any;
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  showToggle = false;
  showHeatmap = false;
  showFlowmap = false;
  myHeatmap: any;
  myHeatLayer: any;
  myFlowmapLayer: any;
  oldHeatmapData: (L.LatLng | L.HeatLatLngTuple)[] = []
  
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
    }, 1000);

      setInterval(() => {
        if (this.showHeatmap) {
          const heatmapData: (L.LatLng | L.HeatLatLngTuple)[] = this.generateHeatmapData();  
          this.myHeatLayer.setLatLngs(heatmapData);
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
      // use L.Gridlayer to create gridlines on the map
      const myGrid = L.GridLayer.extend({
        options: {
          tileSize: 58.05,
          opacity: 0.9,
          zIndex: 1000,
          bounds: this.myHeatmap.getBounds(),
        },
        createTile: (coords: any) => {
          const tile = document.createElement('div');
          const tileSize = this.myHeatmap.getPixelBounds().getSize();
          tile.style.background = 'rgba(0, 0, 0, 0.1)';
          tile.style.border = 'solid 1px rgba(0, 0, 0, 0.5)';
          tile.style.fontSize = '10px';
          tile.style.color = 'rgba(0, 0, 0, 0.5)';
          tile.style.textAlign = 'center';
          // tile.style.lineHeight = tileSize.y + 'px';
          // tile.innerHTML = `[${coords.x}, ${coords.y}]`;
          return tile;
        }
      });

      this.myFlowmapLayer = new myGrid();

      this.myFlowmapLayer.addTo(this.myHeatmap);
      this.myFlowmapLayer.bringToFront();
    } else {
      this.myHeatmap.removeLayer(this.myFlowmapLayer);
    }
  }

  toggleHeatmap() {
    this.showHeatmap = !this.showHeatmap;

    if (this.showHeatmap) {
      const heatmapData: (L.LatLng | L.HeatLatLngTuple)[] = this.generateHeatmapData();

      this.myHeatLayer = L.heatLayer(
        heatmapData,
        {
          radius: 25,
          gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' },
          minOpacity: 0.3
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
    this.myHeatmap = L.map(this.heatmapContainer.nativeElement).setView([0, 0], 13);

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

    const myGrid = L.GridLayer.extend({
      options: {
        tileSize: 58.05,
        opacity: 0.9,
        zIndex: 1000,
        bounds: this.myHeatmap.getBounds(),
      },
      createTile: (coords: any) => {
        const tile = document.createElement('div');
        const tileSize = this.myHeatmap.getPixelBounds().getSize();
        // tile.style.background = 'rgba(209 213 219, 0.4)';
        tile.style.background = 'rgba(0, 0, 0, 0.1)';
        tile.style.border = 'solid 1px rgba(0, 0, 0, 0.2)';
        tile.style.fontSize = '10px';
        tile.style.color = 'rgba(0, 0, 0, 0.5)';
        tile.style.textAlign = 'center';
        // tile.style.lineHeight = tileSize.y + 'px';
        // tile.innerHTML = `[${coords.x}, ${coords.y}]`;
        return tile;
      }
    });

    this.myFlowmapLayer = new myGrid();

    this.myFlowmapLayer.addTo(this.myHeatmap);
    this.myFlowmapLayer.bringToFront();
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
    const bounds = {
      north: 0.031,   // Latitude of the north boundary
      south: -0.0315,   // Latitude of the south boundary
      east: 0.123,   // Longitude of the east boundary
      west: -0.1235    // Longitude of the west boundary
    };
  
    if (this.oldHeatmapData.length === 0)  {
        for (let i = 0; i < 10; i++) {
        const latitude = bounds.south + Math.random() * (bounds.north - bounds.south);
        const longitude = bounds.west + Math.random() * (bounds.east - bounds.west);
        const intensity = 0.5 + Math.random() * 0.5;
    
        this.oldHeatmapData.push([latitude, longitude, intensity]);
      }
    } 

    // Function to generate a random number between min and max (inclusive)
    const getRandomNumber = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
  
    // Maximum distance a data point can be moved (adjust this value as needed)
    const maxDisplacement = 0.0085; // Adjust this value to control the displacement
  
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
        latLngDataPoint.lat = Math.max(bounds.south, Math.min(bounds.north, latLngDataPoint.lat)); // Latitude
        latLngDataPoint.lng = Math.max(bounds.west, Math.min(bounds.east, latLngDataPoint.lng)); // Longitude
      } else {
        // It's a HeatLatLngTuple type
        const heatLatLngDataPoint = dataPoint as L.HeatLatLngTuple;
    
        const latDisplacement = getRandomNumber(-maxDisplacement, maxDisplacement);
        const lngDisplacement = getRandomNumber(-maxDisplacement, maxDisplacement);
    
        heatLatLngDataPoint[0] += latDisplacement; // Latitude
        heatLatLngDataPoint[1] += lngDisplacement; // Longitude
    
        // Make sure the updated data point stays within the defined bounds
        heatLatLngDataPoint[0] = Math.max(bounds.south, Math.min(bounds.north, heatLatLngDataPoint[0])); // Latitude
        heatLatLngDataPoint[1] = Math.max(bounds.west, Math.min(bounds.east, heatLatLngDataPoint[1])); // Longitude
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
      const userCountCtx = userCountCanvas.getContext('2d');
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
      const deviceCountCtx = deviceCountCanvas.getContext('2d');
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
      const userCountDataStreamingCtx = userCountDataStreamingCanvas.getContext('2d');
      if (userCountDataStreamingCtx) {
        const myChart = new Chart(
          userCountDataStreamingCtx, 
          config        
        );
      }
    }

  }
}
