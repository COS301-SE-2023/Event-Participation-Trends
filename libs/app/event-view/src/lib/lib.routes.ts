import { Route } from '@angular/router';
import { DashboardPageComponent, EventDetailsPageComponent } from '@event-participation-trends/app/components';
import { EventViewComponent } from './event-view/event-view.component';

export const appEventViewRoutes: Route[] = [
    {
        path: '',
        component: EventViewComponent,
        children: [
            {
                path: 'dashboard/:id',
                component: DashboardPageComponent
            },
            {
                path: 'details/:id',
                component: EventDetailsPageComponent
            }
        ]
    },
];
