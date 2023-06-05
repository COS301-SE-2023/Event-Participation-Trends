import { Component } from "@angular/core";

@Component({
    selector: 'event-participation-trends-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.css'],
  })
export class HomePage {
    selected = 'Users';
    options = ['Users', 'View', 'Compare Events'];

    selectTab(option: string) {
        this.selected = option;
    }
}