import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComparingeventsState } from '@event-participation-trends/app/comparingevents/data-access';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetAllCategories, GetManagedEventCategories, GetRole, SetSelectedCategory } from '@event-participation-trends/app/comparingevents/util';
import { VieweventsState } from '@event-participation-trends/app/viewevents/data-access';

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
  @Select(ComparingeventsState.managedEventCategories) managedEventCategories$!: Observable<string[] | undefined>;
  @Select(ComparingeventsState.role) role$!: Observable<string | undefined>;
  @ViewChild('content-body', { static: true }) contentBody!: ElementRef;

  selectedEvents: any[] = [];
  maxSelectionAllowed = 2;
  searchValue = '';
  searchSize = 0;
  categoryList: string[] = [];
  userRole: string | undefined;
  didRefreshPage = false;
  isLoading = true;

  constructor(
    private containerElement: ElementRef,
    private readonly store: Store,
  ) {}
  overflow = false;

  ngAfterViewInit() {
    this.checkOverflow();
  }

  ngOnInit() {
    // if user role is admin, get all categories
    setTimeout(() => {
      this.store.dispatch(new GetRole());

      this.role$.subscribe((role) => {
        this.userRole = role ? role : '';
        console.log('role: ', role);

        if (role === 'admin') {
          //get all categories
          this.store.dispatch(new GetAllCategories());

          this.categories$.subscribe((categories) => {
            if (categories) {
              this.categoryList = categories;

              //set selected category to first category
              this.store.dispatch(new SetSelectedCategory(categories[0]));
            }
          });
        } 
        else if (role === 'manager') {
          //get managed event categories
          this.store.dispatch(new GetManagedEventCategories());

          this.managedEventCategories$.subscribe((categories) => {
            if (categories) {
              this.categoryList = categories;

              //set selected category to first category
              this.store.dispatch(new SetSelectedCategory(categories[0]));
            }
          });
        }
      });

      this.isLoading = false;
    }, 1000);
  }

  checkOverflow() {
    const container = this.containerElement.nativeElement;
    this.overflow = container.scrollHeight > container.clientHeight;
  }

  maxSelectionReached = false;

  toggleItemSelection(category: string) {
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
    this.categoryList = [];
    this.searchSize = 0;

    this.role$.subscribe((role) => {
      if (role === 'admin') {
        this.categories$.subscribe((categories) => {
          this.categoryList = categories || [];
        });
      }
      else {
        this.managedEventCategories$.subscribe((categories) => {
          this.categoryList = categories || [];
        });
      }
    });

    this.searchSize = this.categoryList.length;

    return this.categoryList.filter((category) => {
      return category
        ? category.toLowerCase().includes(this.searchValue.toLowerCase())
        : false;
    });
  }

  hasCategories(): boolean {
    const categories = this.getEventCategories();

    this.searchSize = categories.length;

    return categories.length > 0;
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
      this.store.dispatch(new GetManagedEventCategories());

      event.target.complete();
    }, 2000);
  }
}
