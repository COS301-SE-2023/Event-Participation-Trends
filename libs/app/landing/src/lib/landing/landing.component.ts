import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';

@Component({
  selector: 'event-participation-trends-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit, OnInit {
  @ViewChild('gradient') gradient!: ElementRef<HTMLDivElement>;
  @ViewChild('head') head!: ElementRef<HTMLHeadElement>;

  constructor(private appApiService: AppApiService) {}

  public loggedIn = false;
  public username = '';
  public img_url = '';

  async ngOnInit() {
    this.username = await this.appApiService.getUserName();
    this.loggedIn = this.username !== '';
    if(!this.loggedIn){
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.getElementsByTagName('head')[0]?.appendChild(script);
    }
    else{
      this.img_url = await this.appApiService.getProfilePicUrl();
    }
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
