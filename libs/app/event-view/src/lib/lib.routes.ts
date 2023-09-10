import { Route } from '@angular/router';
import { DashboardPageComponent, EventDetailsPageComponent, FloorplanEditorPageComponent } from '@event-participation-trends/app/components';
import { EventViewComponent } from './event-view/event-view.component';

export const appEventViewRoutes: Route[] = [
    {
        path: ':id',
        component: EventViewComponent,
        children: [
            {
                path: '',
                component: DashboardPageComponent
            },
            {
                path: 'dashboard',
                component: DashboardPageComponent
            },
            {
                path: 'details',
                component: EventDetailsPageComponent
            },
            {
                path: 'floorplan',
                component: FloorplanEditorPageComponent
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: './details'
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: './details'
    }
];
