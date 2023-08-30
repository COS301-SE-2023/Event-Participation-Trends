import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matClose } from '@ng-icons/material-icons/baseline';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'event-participation-trends-small-screen-modal',
  standalone: true,
  imports: [CommonModule, NgIconsModule],
  templateUrl: './small-screen-modal.component.html',
  styleUrls: ['./small-screen-modal.component.css'],
  providers: [
    provideIcons({matClose})
  ],
})
export class SmallScreenModalComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

  closeModal() {
    // Navigating from the current route's parent to the 'details' sibling route
    this.router.navigate(['details'], { relativeTo: this.route.parent });    
  }
}
