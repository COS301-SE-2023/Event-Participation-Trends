import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

}
