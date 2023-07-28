import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';

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

  constructor(private appApiService: AppApiService) {}

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

  closeModal() {
    const modal = document.querySelector("#profile-modal");

    modal?.classList.add("hidden");
  }

}
