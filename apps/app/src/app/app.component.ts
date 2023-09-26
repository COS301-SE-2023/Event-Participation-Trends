import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppApiService } from '@event-participation-trends/app/api';
import { AppLandingModule } from '@event-participation-trends/app/landing';

@Component({
  standalone: true,
  imports: [RouterModule, AppLandingModule, HttpClientModule],
  providers: [AppApiService],
  selector: 'event-participation-trends-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
}
