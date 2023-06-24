import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'event-participation-trends-addevent',
  templateUrl: './addevent.page.html',
  styleUrls: ['./addevent.page.css'],
})
export class AddEventPage implements OnInit {
  eventForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventCategory: ['', Validators.required],
      eventStartTime: ['', Validators.required],
      eventEndTime: ['', Validators.required]
    });
  }

  createEvent(): void {
    if (this.eventForm.invalid) {
      alert('Please fill out all fields');
      // Access individual form controls and mark them as touched
      const controls = this.eventForm.controls;
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
    }
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

  // onStartTimeChange() {
  //   const startTime = this.eventForm.get('eventStartTime')?.value;
  //   console.log("Start Time: " + startTime);
  //   let endTime = this.eventForm.get('eventEndTime')?.value;

  //   if (!endTime) {
  //     endTime = this.eventForm.get('eventEndTime')?.setValue(startTime);
  //   }
  
  //   if (((startTime && !endTime) || (startTime && endTime)) && startTime >= endTime) {
  //     // const newEndTime = new Date(startTime);
  //     // newEndTime.setHours(newEndTime.getHours() + 1);
  //     this.eventForm.patchValue({ eventEndTime: endTime.toISOString().slice(0, -8) });
  //     // this.eventForm.get('eventEndTime')?.setValue(newEndTime.toISOString().slice(0, -8));
  //     console.log("End Time: " + endTime);
  //   }
  // }

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

}
