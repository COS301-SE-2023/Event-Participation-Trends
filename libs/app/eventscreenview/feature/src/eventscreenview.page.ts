import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';


@Component({
  selector: 'event-participation-trends-eventscreenview',
  templateUrl: './eventscreenview.page.html',
  styleUrls: ['./eventscreenview.page.css'],
})
export class EventScreenViewPage {
  @ViewChild('heatmapContainer') heatmapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('totalUserCountChart') totalUserCountChart!: ElementRef<HTMLCanvasElement>;

  isLoading = false;
  
  ngAfterViewInit() {
    // wait until the heatmap container is rendered
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 1000);
    this.renderHeatMap();
    this.renderTotalUserCount();
  }

  renderHeatMap() {
    const map = L.map(this.heatmapContainer.nativeElement).setView([51.505, -0.09], 13);

    //disable zoom functionality
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.dragging.disable();

    // disable zoom in and out buttons
    map.removeControl(map.zoomControl);
    map.removeControl(map.attributionControl);


    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: 'Map data &copy; OpenStreetMap contributors',
    //   maxZoom: 18
    // }).addTo(map);

    const imageUrl = 'assets/stage (3).png';
    // const imageBounds: L.LatLngBounds = map.getBounds();
    // get bounds of heatmap container
    const imageBounds: L.LatLngBounds = L.latLngBounds(
      map.containerPointToLatLng(L.point(0, 0)),
      map.containerPointToLatLng(L.point(this.heatmapContainer.nativeElement.offsetWidth, this.heatmapContainer.nativeElement.offsetHeight))
    );
    L.imageOverlay(imageUrl, imageBounds).addTo(map);

    const heatmapData: (L.LatLng | L.HeatLatLngTuple)[] = [
      [51.5, -0.09, 0.2], // lat, lng, intensity
      [51.51, -0.09, 0.5],
      [51.508, -0.09, 0.7]
    ];

    const heat = L.heatLayer(
      heatmapData,
      {
        radius: 25,
        gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' },
        minOpacity: 0.4
      }
    ).addTo(map);
  }

  renderTotalUserCount() {
    const data = {
      datasets: [{
        label: 'Total Users',
        data: [100],
        backgroundColor: [
          '#facc15',
        ],
        borderColor: [
          '#facc15',
        ],
      }]
    };

    const userCountCanvas = this.totalUserCountChart.nativeElement;

    if (userCountCanvas) {
      const userCountCtx = userCountCanvas.getContext('2d');
      if (userCountCtx) {
        const myChart = new Chart(
          userCountCanvas,
          {
            type: 'doughnut',
            data: data,
            options: {
              responsive: true,
              cutout: '80%',
              plugins: {
                tooltip: {
                  enabled: false
                }
              } 
            },  
          }
        );

        // center the text inside the doughnut chart
        Chart.register({
          id: 'center-label',
          beforeDraw: function (chart: any) {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;

            // set font size to 30px
            ctx.font = '30px Arial';

            ctx.restore();
            ctx.textBaseline = 'middle';

            const text = myChart.data.datasets[0].data[0] ;
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2 + 5;

            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        });
      }
      else {
        console.log('userCountCtx is null');
      }
    }
    else {
      console.log('userCountCanvas is null');
    }
  }
}
