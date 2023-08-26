import { Component, OnInit } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute, Router } from '@angular/router';
import { IEvent } from '@event-participation-trends/api/event/util';

@Component({
  selector: 'event-participation-trends-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css'],
})
export class ComparePageComponent implements OnInit{
  public id = '';
  public event : any | null = null;
  public show = false;
  public loading = true;
  public categories: string[] = [];
  public events: IEvent[] = [];
  public eventList: {event: IEvent, selected: boolean}[] = [];
  public show_search = true;
  public role = 'viewer';
  public search = '';

  selectedCategory = '';
  eventsSelected = 0;
  

  constructor(private readonly appApiService: AppApiService, private readonly route: ActivatedRoute, private readonly router: Router) {}

  async ngOnInit() {
    // retrieve categories from API
    this.role = await this.appApiService.getRole();

    if (this.role === 'admin') {
      //get all categories
      this.categories = await this.appApiService.getAllEventCategories();

      //get all events
      this.events = await this.appApiService.getAllEvents();

      for (const event of this.events) {
        this.eventList.push({event, selected: false});
      }

    } else if (this.role === 'manager') {
      //get managed categories
      this.categories = await this.appApiService.getManagedEventCategories();

      //get managed events
      this.events = await this.appApiService.getManagedEvents();

      for (const event of this.events) {
        this.eventList.push({event, selected: false});
      }
    }

    this.loading = false;

    setTimeout(() => {
      this.show = true;
    }, 200);
  }

  isSelected(category: string): boolean {
    return category === this.selectedCategory;
  }

  isSelectedEvent(event: IEvent): boolean {
    const index = this.eventList.findIndex((item) => {
      const sameName = item.event.Name === event.Name;
      const sameStartAndEndDate = item.event.StartDate === event.StartDate && item.event.EndDate === event.EndDate;
      const sameCategory = item.event.Category === event.Category;

      return sameName && sameStartAndEndDate && sameCategory;
    });
    console.log(index);
    return this.eventList[index].selected;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  selectEvent(event: IEvent): void {
    const index = this.eventList.findIndex((item) => {
      const sameName = item.event.Name === event.Name;
      const sameStartAndEndDate = item.event.StartDate === event.StartDate && item.event.EndDate === event.EndDate;
      const sameCategory = item.event.Category === event.Category;

      return sameName && sameStartAndEndDate && sameCategory;
    });

    if (this.eventsSelected === 2 && !this.eventList[index].selected) {
      return;
    }

    this.eventList[index].selected = !this.eventList[index].selected;

    if (this.eventList[index].selected) {
      this.eventsSelected++;
    }
    else {
      this.eventsSelected--;
    }
  }

  highlightText(event: IEvent, search: string): string {
    const text = event.Name;

    if (!text) return search;
    if (!search) return text;

    const pattern = new RegExp(search, 'gi');
    return text.replace(pattern, match => `<span class="bg-opacity-70 bg-ept-bumble-yellow rounded-md">${match}</span>`);
  }

  getEventCategories() : string[] {
    const categoryList = this.categories;

    return categoryList.filter((category) => {
      return category
        ? category.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }

  getEvents() : IEvent[] {
    const eventList = this.events;

    return eventList.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }
}
