import { Component, EventEmitter, Output, NgZone } from '@angular/core';
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
  @Output() justCloseModal = new EventEmitter<boolean>();
  public id: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private ngZone: NgZone) {}

  closeModal() {
    // extract event id from url
    this.id = this.router.url.split('/')[2];

    if (!this.id) {
      this.ngZone.run(() => { this.router.navigate(['/home']); });
    }

    // Navigating from the current route's parent to the 'details' sibling route
    if (!this.router.url.includes('details')) {
      this.ngZone.run(() => { this.router.navigateByUrl(`/event/${this.id}/details`); });
      this.justCloseModal.emit(true);
    }
    else {
      this.justCloseModal.emit(true);
    }
  }
}
