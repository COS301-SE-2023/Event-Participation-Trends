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

class Stats {
  id = 0;
  name = '';
  total_attendance = 0;
  average_attendance = 0;
  peak_attendance = 0;
  turnover_rate = 0;
  average_attendance_time = 0;
  max_attendance_time = 0;
  attendance_over_time_data: number[] = [];
  attendance_over_time_labels: Date[] = [];
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
  @ViewChild('firstAttendanceOverTime')
  firstAttendanceOverTime!: ElementRef<HTMLCanvasElement>;
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

  firstAttendanceOverTimeChart: Chart | null = null;
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
        total_attendance: response.total_attendance!,
        average_attendance: response.average_attendance!,
        peak_attendance: response.peak_attendance!,
        turnover_rate: response.turnover_rate!,
        average_attendance_time: response.average_attendance!,
        max_attendance_time: response.max_attendance_time!,
        attendance_over_time_data: response.attendance_over_time_data!,
        attendance_over_time_labels: response.attendance_over_time_labels!,
      };

      this.eventStats.push(stats);
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
        total_attendance: 0,
        average_attendance: 0,
        peak_attendance: 0,
        turnover_rate: 0,
        average_attendance_time: 0,
        max_attendance_time: 0,
        attendance_over_time_data: [],
        attendance_over_time_labels: [],
      };
    }

    return this.eventStats[0];
  }

  getSecondEventStats(): Stats {
    if (this.eventStats.length <= 1) {
      return {
        id: 0,
        name: '',
        total_attendance: 0,
        average_attendance: 0,
        peak_attendance: 0,
        turnover_rate: 0,
        average_attendance_time: 0,
        max_attendance_time: 0,
        attendance_over_time_data: [],
        attendance_over_time_labels: [],
      };
    }

    return this.eventStats[1];
  }

  renderCharts() {
    {
      // First Attendance Over Time

      if (this.firstAttendanceOverTimeChart) {
        this.firstAttendanceOverTimeChart.destroy();
      }

      const ctx: CanvasRenderingContext2D | null =
        this.firstAttendanceOverTime.nativeElement?.getContext('2d');

      let gradientStroke = null;
      if (ctx) {
        gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
        gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
        gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors
      }

      const labels = this.getFirstEventStats().attendance_over_time_labels.map(
        (date) => {
          return date.toLocaleString();
        }
      );

      const data = this.getFirstEventStats().attendance_over_time_data;

      const config: ChartConfiguration = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
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
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: false,
            },
            legend: {
              display: false,
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
      const firstAttendanceOverTimeCanvas =
        this.firstAttendanceOverTime.nativeElement;

      const firstAttendanceOverTimeCtx =
        firstAttendanceOverTimeCanvas.getContext('2d', {
          willReadFrequently: true,
        });
      this.firstAttendanceOverTimeChart = new Chart(
        firstAttendanceOverTimeCtx!,
        config
      );
    }

    {
      // Second Attendance Over Time

      if (this.secondAttendanceOverTimeChart) {
        this.secondAttendanceOverTimeChart.destroy();
      }

      const ctx: CanvasRenderingContext2D | null =
        this.secondAttendanceOverTime.nativeElement?.getContext('2d');

      let gradientStroke = null;
      if (ctx) {
        gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
        gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
        gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors
      }

      const labels = this.getSecondEventStats().attendance_over_time_labels.map(
        (date) => {
          return date.toLocaleString();
        }
      );

      const data = this.getSecondEventStats().attendance_over_time_data;

      const config: ChartConfiguration = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
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
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: false,
            },
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: this.getSecondEventStats().name,
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
      const secondAttendanceOverTimeCanvas =
        this.secondAttendanceOverTime.nativeElement;

      const secondAttendanceOverTimeCtx =
        secondAttendanceOverTimeCanvas.getContext('2d', {
          willReadFrequently: true,
        });
      this.secondAttendanceOverTimeChart = new Chart(
        secondAttendanceOverTimeCtx!,
        config
      );
    }
  }
}
