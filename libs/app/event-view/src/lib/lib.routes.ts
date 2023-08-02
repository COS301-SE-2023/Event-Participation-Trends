import { Route } from '@angular/router';
import { DashboardPageComponent, EventDetailsPageComponent } from '@event-participation-trends/app/components';

export const appEventViewRoutes: Route[] = [
    {
        path: 'dashboard/:id',
        component: DashboardPageComponent
    },
    {
        path: 'details/:id',
        component: EventDetailsPageComponent
    }
];
