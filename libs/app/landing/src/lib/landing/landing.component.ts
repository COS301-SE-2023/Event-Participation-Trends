import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'event-participation-trends-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit, OnInit {
  @ViewChild('gradient') gradient!: ElementRef<HTMLDivElement>;

  public loggedIn = true;
  public name = 'Lukas';
  public img_url = 'https://avatars.githubusercontent.com/u/11546742?v=4';

  ngOnInit() {
    console.log('LandingComponent.ngOnInit()');
  }  

  ngAfterViewInit() {
    document.addEventListener("mousemove", (event) => {
      const xPos = event.clientX / window.innerWidth;
      const yPos = event.clientY / window.innerHeight;
      this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at ${xPos*100}% ${yPos*100}%, #1d1f26, #101010)`;
    });
    this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at 50% 50%, #1d1f26, #101010)`;
  }
}
