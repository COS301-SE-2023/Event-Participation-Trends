import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';

@Component({
  selector: 'event-participation-trends-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit {
  @ViewChild('gradient') gradient!: ElementRef<HTMLDivElement>;

  constructor(private appApiService: AppApiService) {
    this.appApiService.getUserName().subscribe((response)=>{
      this.username = response.username || '';
      if (this.username !== '') {
        this.loggedIn = false;
      }
    });    
    this.appApiService.getProfilePicUrl().subscribe((response)=>{
      this.img_url = response.url || '';
    });
  }

  public loggedIn = false;
  public username = '';
  public img_url = '';

  ngAfterViewInit() {
    document.addEventListener("mousemove", (event) => {
      const xPos = event.clientX / window.innerWidth;
      const yPos = event.clientY / window.innerHeight;
      this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at ${xPos*100}% ${yPos*100}%, #1d1f26, #101010)`;
    });
    this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at 50% 50%, #1d1f26, #101010)`;
  }
}
