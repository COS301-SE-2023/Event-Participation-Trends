import { Component, Input } from '@angular/core';

@Component({
  selector: 'subpagenav',
  templateUrl: './subpagenav.page.html',
  styleUrls: ['./subpagenav.page.css'],
})
export class SubPageNavPage {
  @Input() currentPage!: string;
}
