import { Component } from "@angular/core";
import { AppApiService } from "@event-participation-trends/app/api";

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

    public role = 'Viewer';
    constructor(private appApiService: AppApiService) {
        this.appApiService.getRole().then((role) => {
            console.log('role', role);
            this.role = role.userRole ? role.userRole : 'Viewer';
        });
    }

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

    allowUsers(): boolean {
        return this.role === 'admin';
    }

    allowView(): boolean {
        return this.role === 'manager' || this.role === 'admin';
    }

    allowCompare(): boolean {
        return this.role === 'manager' || this.role === 'admin';
    }

}