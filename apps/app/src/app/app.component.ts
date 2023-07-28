import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLandingModule } from '@event-participation-trends/app/landing'

@Component({
  standalone: true,
  imports: [RouterModule, AppLandingModule],
  selector: 'event-participation-trends-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
}
