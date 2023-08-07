import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'event-participation-trends-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public name = '';
  public img_url = '';
  public role = '';

  constructor(private appApiService: AppApiService, private cookieService: CookieService) {}

  async ngOnInit() {
    this.name = await this.appApiService.getFullName();
    this.img_url = await this.appApiService.getProfilePicUrl();
    this.role = await this.appApiService.getRole();

    switch (this.role) {
      case 'admin':
        this.role = 'Administrator';
        break;
      case 'manager':
        this.role = 'Manager';
        break;
      case 'viewer':
        this.role = 'Viewer';
        break;
      default:
        this.role = 'How did you get here?';
        break;
    }
  }

  pressButton(id: string) {
    const target = document.querySelector(id);

    target?.classList.add('hover:scale-90');
    setTimeout(() => {
      target?.classList.remove('hover:scale-90');
    }, 100);
  }

  closeModal() {
    this.pressButton('#close-button');
    const modal = document.querySelector('#profile-modal');

    modal?.classList.add('opacity-0');
    setTimeout(() => {
      modal?.classList.add('hidden');
    }, 300);
  }

  logout() {
    this.pressButton('#logout-button');
    
    // clear cookie
    this.cookieService.delete('jwt');
    this.cookieService.delete('csrf');

    this.closeModal();

    // redirect to login page
    window.location.href = '/';
  }
}
