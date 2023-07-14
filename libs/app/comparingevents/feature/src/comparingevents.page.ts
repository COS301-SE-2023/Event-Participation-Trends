import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComparingeventsState } from '@event-participation-trends/app/comparingevents/data-access';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetAllCategories, SetSearchedCategories, SetSelectedCategory } from '@event-participation-trends/app/comparingevents/util';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  selected: boolean;
}

@Component({
  selector: 'event-participation-trends-comparingevents',
  templateUrl: './comparingevents.page.html',
  styleUrls: ['./comparingevents.page.css'],
})
export class ComparingeventsPage {
  @Select(ComparingeventsState.selectedCategory) selectedCategory$!: Observable<string | undefined>;
  @Select(ComparingeventsState.categories) categories$!: Observable<string[] | undefined>;
  @Select(ComparingeventsState.searchedCategories) searchedCategories$!: Observable<string[] | undefined>;
  @ViewChild('content-body', { static: true }) contentBody!: ElementRef;

  selectedEvents: any[] = [];
  maxSelectionAllowed = 2;
  searchValue = '';
  searchSize = 0;

  constructor(
    private containerElement: ElementRef,
    private readonly store: Store,
  ) {}
  overflow = false;

  ngAfterViewInit() {
    this.checkOverflow();

    this.store.dispatch(new GetAllCategories());

    this.categories$.subscribe((categories) => {
      if (categories) {
        this.store.dispatch(new SetSelectedCategory(categories[0]));
        this.store.dispatch(new SetSearchedCategories(categories));
      }
    });

  }

  checkOverflow() {
    const container = this.containerElement.nativeElement;
    this.overflow = container.scrollHeight > container.clientHeight;
  }
  
  // define events array
  events:Event[] = [
    {
      id: 1,
      name: 'Event 1',
      date: '2021-01-01',
      location: 'Location 1',
      description: 'Description 1',
      selected: false,
    },
    {
      id: 2,
      name: 'Event 2',
      date: '2021-01-02',
      location: 'Location 2',
      description: 'Description 2',
      selected: false,
    },
    {
      id: 3,
      name: 'Event 3',
      date: '2021-01-03',
      location: 'Location 3',
      description: 'Description 3',
      selected: false,
    },
    {
      id: 4,
      name: 'Event 4',
      date: '2021-01-04',
      location: 'Location 4',
      description: 'Description 4',
      selected: false,
    },
    {
      id: 5,
      name: 'Event 5',
      date: '2021-01-01',
      location: 'Location 5',
      description: 'Description 5',
      selected: false,
    },
    {
      id: 6,
      name: 'Event 6',
      date: '2021-01-02',
      location: 'Location 6',
      description: 'Description 6',
      selected: false,
    },
    {
      id: 7,
      name: 'Event 7',
      date: '2021-01-03',
      location: 'Location 7',
      description: 'Description 7',
      selected: false,
    },
    {
      id: 8,
      name: 'Event 8',
      date: '2021-01-04',
      location: 'Location 8',
      description: 'Description 8',
      selected: false,
    },
  ];

  // events: Event[] = [];

  maxSelectionReached = false;

  isEmpty(): boolean {
    return this.events.length === 0;
  }

  toggleItemSelection(category: string) {
    // if (this.selectedEvents.includes(event)) {
    //   // Remove from selectedEvents
    //   this.selectedEvents = this.selectedEvents.filter(
    //     (selectedEvent) => selectedEvent !== event
    //   );
    //   event.selected = false;
    // } else if (this.selectedEvents.length < this.maxSelectionAllowed) {
    //   // Add to selectedEvents
    //   event.selected = true;
    //   this.selectedEvents.push(event);
    // }

    // if (this.selectedEvents.length < this.maxSelectionAllowed) {
    //   this.maxSelectionReached = false;
    // } else {
    //   this.maxSelectionReached = true;
    // }
    // console.log(category);
    this.store.dispatch(new SetSelectedCategory(category));
  }

  isItemDisabled(event: any): boolean {
    return this.isMaxSelectionReached() && !this.isSelected(event);
  }

  isMaxSelectionReached(): boolean {
    return this.maxSelectionReached && this.selectedEvents.length >= this.maxSelectionAllowed;
  }

  isSelected(event: any): boolean {
    return event.selected;
  }

  getEventCategories() : string[] {
    let categoryList: string[] | undefined = [];
    this.categories$.subscribe((categories) => {
      categoryList = categories;
    });
    return categoryList.filter((category) => {
      return category
        ? category.toLowerCase().includes(this.searchValue.toLowerCase())
        : false;
    });
  }

  isSelectedCategory(category: string): boolean {
    let isSelected = false;
    this.selectedCategory$.subscribe((selectedCategory) => {
      isSelected = selectedCategory === category;
      return isSelected;
    });

    return isSelected;
  }

  highlightText(text: string, search: string): string {
    if (!search || !text) {
      return text;
    }

    const pattern = new RegExp(search, 'gi');
    return text.replace(pattern, match => `<span class="bg-ept-bumble-yellow">${match}</span>`);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      let old_categories = [];
      this.categories$.subscribe((categories) => {
        if (categories) {
          old_categories = categories;
        }
      });

      this.store.dispatch(new GetAllCategories());
      // this.store.dispatch(new GetMyEvents());

      event.target.complete();
    }, 2000);
  }
}
