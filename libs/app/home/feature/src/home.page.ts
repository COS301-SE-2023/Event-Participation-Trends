import { Component } from "@angular/core";

@Component({
    selector: 'event-participation-trends-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.css'],
  })
export class HomePage {
    selected = 'Users';
    usersSelected = true;
    viewSelected = false;
    compareSelected = false;

    options = ['Users', 'View', 'Compare Events'];

    selectTab(option: string) {
        this.selected = option;

        if (option === 'Users') {
            this.usersSelected = true;
            this.viewSelected = false;
            this.compareSelected = false;
        }
        else if (option === 'View') {
            this.usersSelected = false;
            this.viewSelected = true;
            this.compareSelected = false;
        }
        else if (option === 'Compare Events') {
            this.usersSelected = false;
            this.viewSelected = false;
            this.compareSelected = true;
        }
    }
}