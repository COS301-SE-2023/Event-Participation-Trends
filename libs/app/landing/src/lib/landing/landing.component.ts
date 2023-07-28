import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'event-participation-trends-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit {
  @ViewChild('gradient') gradient!: ElementRef<HTMLDivElement>;
  ngAfterViewInit() {
    document.addEventListener("mousemove", (event) => {
      const xPos = event.clientX / window.innerWidth;
      const yPos = event.clientY / window.innerHeight;
      this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at ${xPos*100}% ${yPos*100}%, #22242C, #101010)`;
    });
    this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at 50% 50%, #22242C, #101010)`;
  }
}
