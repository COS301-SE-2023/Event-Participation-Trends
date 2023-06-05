import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'event-participation-trends-comparingevents',
  templateUrl: './comparingevents.page.html',
  styleUrls: ['./comparingevents.page.css'],
})
export class ComparingeventsPage {
  @ViewChild('content-body', { static: true }) contentBody!: ElementRef;

  constructor(private containerElement: ElementRef) {}
  overflow = false;

  ngAfterViewInit() {
    this.checkOverflow();
  }

  checkOverflow() {
    const container = this.containerElement.nativeElement;
    this.overflow = container.scrollHeight > container.clientHeight;
  }
}
