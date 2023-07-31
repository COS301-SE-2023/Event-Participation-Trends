import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateEventResponse, IEvent, IEventDetails } from '@event-participation-trends/api/event/util';
import { AppApiService } from '@event-participation-trends/app/api';
import * as moment from 'moment';
import { NavigationExtras, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AddEventState } from '@event-participation-trends/app/addevent/data-access';
import { Observable } from 'rxjs';
import { SetCanCreateFloorPlan, SetNewlyCreatedEvent } from '@event-participation-trends/app/addevent/util';
import { AddNewlyCreatedEvent } from '@event-participation-trends/app/viewevents/util';

@Component({
  selector: 'event-participation-trends-addevent',
  templateUrl: './addevent.page.html',
  styleUrls: ['./addevent.page.css'],
})
export class AddEventPage implements OnInit {
  @Select(AddEventState.getCanCreateFloorPlan) canCreateFloorPlan$!: Observable<boolean>;
  @Select(AddEventState.getNewlyCreatedEvent) newlyCreatedEvent$!: Observable<IEvent | null>;

  eventForm!: FormGroup;

  constructor(
    public formBuilder: FormBuilder, 
    private appApiService: AppApiService,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,
    private readonly loadingController: LoadingController,
    private readonly router: Router,
    private readonly store: Store  
  ) {}

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventCategory: ['', Validators.required],
      eventStartTime: ['', Validators.required],
      eventEndTime: ['', Validators.required]
    });

    this.store.dispatch(new SetCanCreateFloorPlan(false));
  }

  isLoading = false;
  canCreateFloorPlan = false;

  async createEvent() {
    const selectedDate = (document.getElementById('date') as HTMLIonInputElement).value;
    const selectedStartTime = (document.getElementById('startTime') as HTMLIonInputElement).value;
    const selectedEndTime = (document.getElementById('endTime') as HTMLIonInputElement).value;

    const event: IEventDetails = {
      Name: this.eventName?.value,
      StartDate: this.combineDateTime(selectedDate, selectedStartTime),
      EndDate: this.combineDateTime(selectedDate, selectedEndTime),
      Location: {
        "Latitude": -25.7461,
        "Longitude": 28.1881,
        "StreetName": "Lynnwood Road",
        "CityName": "Pretoria",
        "ProvinceName": "Gauteng",
        "CountryName": "South Africa",
        "ZIPCode": "0028",
      },
      Category: this.eventCategory?.value,
    };

    const loading = await this.loadingController.create({
      message: 'Creating event...',
      spinner: 'circles'
    });
    await loading.present();

    if (this.validEvent(event)) {
      this.appApiService.createEvent(event).subscribe((response: ICreateEventResponse) => {
        if (response && response.status) {        
          this.presentToastSuccess('bottom', 'Event created successfully');
          loading.dismiss();
          this.store.dispatch(new SetCanCreateFloorPlan(true));

          // get newly created event
          this.appApiService.getManagedEvents().subscribe((response) => {
            let newEvent: IEvent = {};
            newEvent = response.events[response.events.length - 1];
            
            // set state
            this.store.dispatch(new SetNewlyCreatedEvent(newEvent));

            // Update viewevents
            this.store.dispatch(new AddNewlyCreatedEvent(newEvent));
          });

          // setTimeout(() => {
          //   this.router.navigateByUrl('/home/viewevents');
          // },1000);
          // setTimeout(() => {
          //   location.reload();
          // }, 1200); 
        }
        else {
          this.presentToastFailure('bottom', 'Event creation failed. Please try again.');
          loading.dismiss();
          this.eventForm.reset();
        }
      });
    }
    else {
      this.presentToastFailure('bottom', 'Invalid event data. Please try again.');
      this.eventForm.reset();
    }
  }

  validEvent(event: IEventDetails): boolean | null | undefined{
    return !!(event.Name && event.StartDate && event.EndDate && event.Location && event.Category);
  }

  // combineDateTime(date: string | number | undefined | null, time: string | number | undefined | null): Date {

  //   const combinedDateTimeString = `${date}T${time}:00.000Z`;
  //   const combinedDateTime = new Date(combinedDateTimeString);

  //   return combinedDateTime;
  // }
  combineDateTime(date: string | number | undefined | null, time: string | number | undefined | null): Date {
    // test if date and time are valid
    if (!date || !time || typeof date !== 'string' || typeof time !== 'string') {
      return new Date();
    }
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
  
    // Create a new Date object using the local time zone
    const combinedDateTime = new Date(year, month - 1, day, hours, minutes);

    // Adjust the combinedDateTime to UTC by subtracting the local time zone offset
    const utcCombinedDateTime = new Date(combinedDateTime.getTime() - combinedDateTime.getTimezoneOffset() * 60000);

    return utcCombinedDateTime;
  }

  async presentToastSuccess(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: position,
      color: 'success',
    });

    await toast.present();
  }

  async presentToastFailure(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: position,
      color: 'danger',
    });

    await toast.present();
  }

  get eventName() {
    return this.eventForm.get('eventName');
  }

  get eventDate() {
    return this.eventForm.get('eventDate');
  }

  get eventLocation() {
    return this.eventForm.get('eventLocation');
  }

  get eventCategory() {
    return this.eventForm.get('eventCategory');
  }

  get eventStartTime() {
    return this.eventForm.get('eventStartTime');
  }

  get eventEndTime() {
    return this.eventForm.get('eventEndTime');
  }

  onStartTimeChange() {
    const startTime = this.eventForm.get('eventStartTime')?.value;
    let endTime = this.eventForm.get('eventEndTime')?.value;

    if (!endTime) {
      endTime = moment(startTime, 'HH:mm').add(1, 'hours').format('HH:mm');
      this.eventForm.patchValue({ eventEndTime: endTime });
    }
    else if (startTime && endTime && startTime >= endTime) {
      const newEndTime = moment(startTime, 'HH:mm').add(1, 'hours').format('HH:mm');
      this.eventForm.patchValue({ eventEndTime: newEndTime });
    }
  }

  onEndTimeChange() {
    let startTime = this.eventForm.get('eventStartTime')?.value;
    const endTime = this.eventForm.get('eventEndTime')?.value;

    if (!startTime) {
      startTime = moment(endTime, 'HH:mm').subtract(1, 'hours').format('HH:mm');
      this.eventForm.patchValue({ eventStartTime: startTime });
    }
    else if (endTime && startTime && endTime <= startTime) {
      const newStartTime = moment(endTime, 'HH:mm').subtract(1, 'hours').format('HH:mm');
      this.eventForm.patchValue({ eventStartTime: newStartTime });
    }
  }

  getCurrentDate(): string {
    return new Date().toISOString().split("T")[0];
  }

  openFloorPlanEditor() {
    this.newlyCreatedEvent$.subscribe((event: any) => {
      if (event) {
        const queryParams: NavigationExtras = {
          queryParams: {
            m: false,
            id: event._id,
            queryParamsHandling: 'merge'
          }
        };

        this.router.navigate(['/event/createfloorplan'], queryParams);
      }
    });    
  }
}
