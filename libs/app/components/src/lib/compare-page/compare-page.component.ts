import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IEvent,
  IGetEventStatisticsResponse,
  IPosition,
} from '@event-participation-trends/api/event/util';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { HeatmapContainerComponent } from '../heatmap-container/heatmap-container.component';

import { matCheckCircleOutline } from '@ng-icons/material-icons/outline';
import {
  matRadioButtonUnchecked,
  matSearch,
  matFilterCenterFocus,
  matZoomIn,
  matZoomOut,
} from '@ng-icons/material-icons/baseline';
import { heroAdjustmentsHorizontal } from '@ng-icons/heroicons/outline';
import { heroInboxSolid } from '@ng-icons/heroicons/solid';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import 'chartjs-plugin-datalabels';
import { layerGroup } from 'leaflet';

class Stats {
  id = 0;
  name = '';
  start_time = new Date();
  end_time = new Date();
  total_attendance = 0;
  average_attendance = 0;
  peak_attendance = 0;
  turnover_rate = 0;
  average_attendance_time = 0;
  max_attendance_time = 0;
  attendance_over_time_data: {time: number, devices: number}[] = [];
}

@Component({
  selector: 'event-participation-trends-compare-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIconsModule,
    HeatmapContainerComponent,
  ],
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css'],
  providers: [
    provideIcons({
      matCheckCircleOutline,
      matRadioButtonUnchecked,
      heroAdjustmentsHorizontal,
      matSearch,
      matFilterCenterFocus,
      matZoomIn,
      matZoomOut,
      heroInboxSolid,
    }),
  ],
})
export class ComparePageComponent implements OnInit {
  @ViewChild('attendanceOverTime')
  attendanceOverTime!: ElementRef<HTMLCanvasElement>;
  @ViewChild('secondAttendanceOverTime')
  secondAttendanceOverTime!: ElementRef<HTMLCanvasElement>;

  public id = '';
  public event: any | null = null;
  public show = false;
  public loading = true;
  public categories: string[] = [];
  public events: IEvent[] = [];
  public eventList: { event: IEvent; selected: boolean }[] = [];
  public show_search = true;
  public role = 'viewer';
  public search = '';
  public showSidePanel = false;
  public sidePanelToggled = false;
  public largeScreen = false;
  public hintText = 'Use the tab on the right to select events.';

  attendanceOverTimeChart: Chart | null = null;
  secondAttendanceOverTimeChart: Chart | null = null;

  selectedCategory = 'Show All';
  eventsSelected = 0;
  showDropDown = false;
  selectedEvents: IEvent[] = [];
  eventStats: Stats[] = [];

  parentContainer: HTMLDivElement | null = null;

  chartColors = {
    'ept-deep-grey': '#101010',
    'ept-bumble-yellow': '#facc15',
    'ept-off-white': '#F5F5F5',
    'ept-blue-grey': '#B1B8D4',
    'ept-navy-blue': '#22242A',
    'ept-light-blue': '#57D3DD',
    'ept-light-green': '#4ade80',
    'ept-light-red': '#ef4444',
  };

  constructor(
    private readonly appApiService: AppApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  async ngOnInit() {
    // retrieve categories from API
    this.role = await this.appApiService.getRole();

    if (this.role === 'admin') {
      //get all categories
      this.categories = await this.appApiService.getAllEventCategories();

      //get all events
      this.events = await this.appApiService.getAllEvents();

      for (const event of this.events) {
        this.eventList.push({ event, selected: false });
      }
    } else if (this.role === 'manager') {
      //get managed categories
      this.categories = await this.appApiService.getManagedEventCategories();

      //get managed events
      this.events = await this.appApiService.getManagedEvents();

      for (const event of this.events) {
        this.eventList.push({ event, selected: false });
      }
    } else {
      this.router.navigate(['/home']);
    }

    // test if window size is less than 1100px
    if (window.innerWidth < 1100) {
      this.showSidePanel = false;
      this.hintText =
        'Use the button in the top right corner to select events.';
    } else {
      this.showSidePanel = true;
      this.hintText = 'Use the tab on the right to select events.';
    }

    if (window.innerWidth > 1024) {
      this.largeScreen = true;
    } else {
      this.largeScreen = false;
    }

    this.loading = false;

    setTimeout(() => {
      this.show = true;
      this.parentContainer = document.getElementById(
        'parentContainer'
      ) as HTMLDivElement;
    }, 200);
  }

  toggleDropDown(): void {
    this.showDropDown = !this.showDropDown;
  }

  setDropDown(value: boolean): void {
    this.showDropDown = value;
  }

  clearSearch(): void {
    this.search = '';
  }

  isSelected(category: string): boolean {
    return category === this.selectedCategory;
  }

  isSelectedEvent(event: IEvent): boolean {
    const index = this.eventList.findIndex((item) => {
      const sameName = item.event.Name === event.Name;
      const sameStartAndEndDate =
        item.event.StartDate === event.StartDate &&
        item.event.EndDate === event.EndDate;
      const sameCategory = item.event.Category === event.Category;

      return sameName && sameStartAndEndDate && sameCategory;
    });
    return this.eventList[index].selected;
  }

  selectCategory(event: any): void {
    this.selectedCategory = event.target.value;

    if (this.selectedCategory === 'Show All') {
      this.clearSearch();
    }
  }

  async removeAnyNonSelectedEventStats() {
    for (const item of this.eventList) {
      if (item.selected) {
        //check if it is in the stats array
        const index = this.eventStats.findIndex((stat) => {
          return stat.id === (item.event as any)._id;
        });

        if (index === -1) {
          this.eventStats.push({
            id: (item.event as any)._id,
            name: item.event.Name!,
            start_time: new Date(item.event.StartDate!),
            end_time: new Date(item.event.EndDate!),
            total_attendance: 0,
            average_attendance: 0,
            peak_attendance: 0,
            turnover_rate: 0,
            average_attendance_time: 0,
            max_attendance_time: 0,
            attendance_over_time_data: [],
          });
        }
      }
      else {
        const index = this.eventStats.findIndex((stat) => {
          return stat.id === (item.event as any)._id;
        });

        if (index !== -1) {
          this.eventStats.splice(index, 1);
        }
      }
    }
  }

  async selectEvent(event: IEvent): Promise<void> {
    const index = this.eventList.findIndex((item) => {
      const sameName = item.event.Name === event.Name;
      const sameStartAndEndDate =
        item.event.StartDate === event.StartDate &&
        item.event.EndDate === event.EndDate;
      const sameCategory = item.event.Category === event.Category;

      return sameName && sameStartAndEndDate && sameCategory;
    });

    if (this.eventsSelected === 2 && !this.eventList[index].selected) {
      return;
    }

    this.eventList[index].selected = !this.eventList[index].selected;

    if (this.eventList[index].selected) {
      this.eventsSelected++;
      this.selectedEvents.push(event);

      const response = await this.appApiService.getEventStatistics({
        eventId: (event as any)._id,
      });

      const stats = {
        id: (event as any)._id,
        name: event.Name!,
        start_time: new Date(event.StartDate!),
        end_time: new Date(event.EndDate!),
        total_attendance: response.total_attendance!,
        average_attendance: response.average_attendance!,
        peak_attendance: response.peak_attendance!,
        turnover_rate: response.turnover_rate!,
        average_attendance_time: response.average_attendance!,
        max_attendance_time: response.max_attendance_time!,
        attendance_over_time_data: response.attendance_over_time_data!,
      };

      // check if event is not already in the stats array
      const eventIndex = this.eventStats.findIndex((item) => {
        return item.id === stats.id;
      });

      if (eventIndex === -1) {
        this.eventStats.push(stats);
      }
      this.renderCharts();
    } else {
      this.eventsSelected--;
      const eventIndex = this.selectedEvents.findIndex((item) => {
        const sameName = item.Name === event.Name;
        const sameStartAndEndDate =
          item.StartDate === event.StartDate && item.EndDate === event.EndDate;
        const sameCategory = item.Category === event.Category;

        return sameName && sameStartAndEndDate && sameCategory;
      });
      this.selectedEvents.splice(eventIndex, 1);

      const statsIndex = this.eventStats.findIndex((item) => {
        return item.id === (event as any)._id;
      });
      this.eventStats.splice(statsIndex, 1);
      this.renderCharts();
    }

    this.showDropDown = false;
    
    // ensure all other selected event have their stats showing
    await this.removeAnyNonSelectedEventStats();
  }

  highlightText(event: IEvent, search: string): string {
    const text = event.Name;

    if (!text) return search;
    if (!search) return text;

    const pattern = new RegExp(search, 'gi');
    return text.replace(
      pattern,
      (match) =>
        `<span class="bg-opacity-70 bg-ept-bumble-yellow rounded-md">${match}</span>`
    );
  }

  getEventCategories(): string[] {
    const categoryList: string[] = [];

    this.events.forEach((event) => {
      if (event && event.Name && event.Category) {
        if (
          event.Name.toLowerCase().includes(this.search.toLowerCase()) &&
          !categoryList.includes(event.Category)
        ) {
          categoryList.push(event.Category);
        }
      }
    });

    return categoryList;
  }

  getEvents(): IEvent[] {
    const eventList = this.events;

    if (this.selectedCategory == 'Show All') {
      return eventList.filter((event) => {
        return event.Name
          ? event.Name.toLowerCase().includes(this.search.toLowerCase())
          : false;
      });
    } else {
      return eventList.filter((event) => {
        return event.Name
          ? event.Name.toLowerCase().includes(this.search.toLowerCase()) &&
              event.Category == this.selectedCategory
          : false;
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.hideSidePanel();
    if (event.target.innerWidth > 1100) {
      this.showSidePanel = true;
      this.hintText = 'Use the tab on the right to select events.';
    } else {
      this.showSidePanel = false;
      this.hintText =
        'Use the button in the top right corner to select events.';
    }

    if (event.target.innerWidth > 1024) {
      this.largeScreen = true;
    } else {
      this.largeScreen = false;
    }
  }

  openSidePanel() {
    const element = document.getElementById('sidePanel');
    if (element) {
      element.style.width = '315px';
    }
    this.sidePanelToggled = true;
  }

  hideSidePanel() {
    this.sidePanelToggled = false;
    const element = document.getElementById('sidePanel');
    if (element) {
      element.style.width = '0px';
    }
  }

  getFirstEventStats(): Stats {
    if (this.eventStats.length === 0) {
      return {
        id: 0,
        name: '',
        start_time: new Date(),
        end_time: new Date(),
        total_attendance: 0,
        average_attendance: 0,
        peak_attendance: 0,
        turnover_rate: 0,
        average_attendance_time: 0,
        max_attendance_time: 0,
        attendance_over_time_data: [],
      };
    }

    return this.eventStats[0];
  }

  getSecondEventStats(): Stats {
    if (this.eventStats.length <= 1) {
      return {
        id: 0,
        name: '',
        start_time: new Date(),
        end_time: new Date(),
        total_attendance: 0,
        average_attendance: 0,
        peak_attendance: 0,
        turnover_rate: 0,
        average_attendance_time: 0,
        max_attendance_time: 0,
        attendance_over_time_data: [],
      };
    }

    return this.eventStats[1];
  }

  renderCharts() {
    {
      // First Attendance Over Time

      if (this.attendanceOverTimeChart) {
        this.attendanceOverTimeChart.destroy();
      }

      if (this.eventStats.length === 0) {
        return;
      }
      const ctx: CanvasRenderingContext2D | null =
        this.attendanceOverTime?.nativeElement?.getContext('2d');

      let gradientStroke = null;
      if (ctx) {
        gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
        gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
        gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors
      }

      // find the longest runtime of the events
      const longestRuntime = Math.max(
        ...this.eventStats.map((event) => {
          return event.end_time.getTime() - event.start_time.getTime();
        })
      ) / 1000;

      // set labels as every 20 minute interval of the longest runtime

      const labels = [];

      const interval = 20;

      for (let i = 0; i < longestRuntime; i += 60 * interval) {
        labels.push(i / 60);
      }

      console.log("labels => ", labels);

      const datasets = [];

      const data = labels.map((label) => {
        // if the label exists as a "time" in the attendance_over_time_data, return the devices
        // else return 0

        const event = this.getFirstEventStats();

        const index = event.attendance_over_time_data.findIndex(
          (data) => {
            return data.time === label;
          }
        );

        if (index !== -1) {
          console.log(label, " => ", event.attendance_over_time_data[index].devices);
          return event.attendance_over_time_data[index].devices;
        }

        console.log(label, " => ", 0);
        return 0;
      });

      datasets.push({
        label: this.getFirstEventStats().name,
        data: data,
        fill: true,
        backgroundColor: gradientStroke ? gradientStroke : 'white',
        borderColor: this.chartColors['ept-bumble-yellow'],
        borderWidth: 1,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: this.chartColors['ept-bumble-yellow'],
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: this.chartColors['ept-bumble-yellow'],
        pointBorderWidth: 1,
        pointHoverRadius: 1,
        pointHoverBorderWidth: 1,
        pointRadius: 1,
      });

      if (this.eventStats.length > 1) {
        const secondData = this.getSecondEventStats();
        datasets.push({
          label: this.getSecondEventStats().name,
          data: labels.map((label) => {
            // if the label exists as a "time" in the attendance_over_time_data, return the devices
            // else return 0
    
            const event = this.getSecondEventStats();
    
            const index = event.attendance_over_time_data.findIndex(
              (data) => {
                return data.time === label;
              }
            );
    
            if (index !== -1) {
              return event.attendance_over_time_data[index].devices;
            }
    
            return 0;
          }),
          fill: true,
          backgroundColor: gradientStroke ? gradientStroke : 'white',
          borderColor: this.chartColors['ept-light-blue'],
          borderWidth: 1,
          borderDash: [],
          pointBackgroundColor: this.chartColors['ept-light-blue'],
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: this.chartColors['ept-light-blue'],
          pointBorderWidth: 1,
          pointHoverRadius: 1,
          pointHoverBorderWidth: 1,
          pointRadius: 1,
        });
      }

      const config: ChartConfiguration = {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: false,
            },
            legend: {
              display: true,
            },
            title: {
              display: true,
              text: this.getFirstEventStats().name,
              color: this.chartColors['ept-off-white'], // Set the title text color to white
            },
          },
          scales: {
            x: {
              display: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)', // Adjust the color of the x-axis grid lines
              },
              ticks: {
                color: this.chartColors['ept-blue-grey'], // Adjust the color of the x-axis labels
              },
            },
            y: {
              display: true,
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)', // Adjust the color of the y-axis grid lines
              },
              ticks: {
                color: this.chartColors['ept-blue-grey'], // Adjust the color of the y-axis labels
              },
            },
          },
          elements: {
            line: {
              tension: 0.3, // Adjust the tension of the line for a smoother curve
              borderWidth: 1,
            },
          },
        },
      };
      const attendanceOverTimeCanvas = this.attendanceOverTime?.nativeElement;

      const attendanceOverTimeCtx = attendanceOverTimeCanvas?.getContext('2d', {
        willReadFrequently: true,
      });

      if (attendanceOverTimeCtx) {
        this.attendanceOverTimeChart = new Chart(attendanceOverTimeCtx, config);
      }
    }
  }
}
