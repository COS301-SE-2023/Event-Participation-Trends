import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewEventsPageComponent } from '@event-participation-trends/app/components';

export const appHomeRoutes: Route[] = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: ViewEventsPageComponent
            }
        ]
    }
];
