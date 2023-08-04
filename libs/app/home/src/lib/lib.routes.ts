import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllEventsPageComponent, UsersPageComponent, ComparePageComponent } from '@event-participation-trends/app/components';

export const appHomeRoutes: Route[] = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: AllEventsPageComponent
            },
            {
                path: 'events',
                component: AllEventsPageComponent
            },
            {
                path: 'compare',
                component: ComparePageComponent
            },
            {
                path: 'users',
                component: UsersPageComponent
            }
        ]
    }
];
