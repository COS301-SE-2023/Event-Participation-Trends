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
import { Store } from '@ngxs/store';
import { NgIconsModule } from '@ng-icons/core';
import { heroUserGroup } from '@ng-icons/heroicons/outline';

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

    this.loading = false;
    setTimeout(() => {
      this.show = true;
    }, 200);

  }
}
