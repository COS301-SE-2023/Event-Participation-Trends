import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { GetAllCategories, GetManagedEventCategories, GetRole, SetCompareEventsState, SetRole, SetSelectedCategory, UpdateCategories } from '@event-participation-trends/app/comparingevents/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { SetError } from '@event-participation-trends/app/error/util';
import { Observable } from 'rxjs';
import { IGetUserRoleResponse } from '@event-participation-trends/api/user/util';

// Once we know the interface for the Comparingevents page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComparingeventsStateModel {
    selectedCategory: string;
    categories: string[];
    managedEventCategories: string[];
    role: string;
}

@State<ComparingeventsStateModel>({
    name: 'comparingevents',
    defaults: {
        selectedCategory: '',
        categories: [],
        managedEventCategories: [],
        role: '',
    },
})

@Injectable()
export class ComparingeventsState {

    @Selector()
    static selectedCategory(state: ComparingeventsStateModel) {
        return state.selectedCategory;
    }

    @Selector()
    static categories(state: ComparingeventsStateModel) {
        return state.categories;
    }

    @Selector()
    static managedEventCategories(state: ComparingeventsStateModel) {
        return state.managedEventCategories;
    }

    @Selector()
    static role(state: ComparingeventsStateModel): string {
        return state.role;
    }

    constructor(
        private readonly store: Store,
        private readonly appApiService: AppApiService,
    ) {}

    @Action(SetCompareEventsState)
    setCompareEventsState(ctx: StateContext<ComparingeventsStateModel>, { newState }: SetCompareEventsState) {
        ctx.setState(newState);
    }

    @Action(SetSelectedCategory)
    setSelectedCategory(ctx: StateContext<ComparingeventsStateModel>, { newCategory }: SetSelectedCategory) {
        ctx.patchState({
            selectedCategory: newCategory,
        });
    }

    @Action(UpdateCategories)
    updateCategories(ctx: StateContext<ComparingeventsStateModel>, { categories }: UpdateCategories) {
        ctx.patchState({
            categories,
        });
    }

    @Action(GetAllCategories)
    async getAllCategories(ctx: StateContext<ComparingeventsStateModel>) {
        try {
            const categories = await this.appApiService.getAllEventCategories();

            if (categories && categories.length > 0) {
                return ctx.dispatch(new UpdateCategories(categories));
            }
            return;
        } catch(error) {
            return this.store.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(GetManagedEventCategories)
    async getManagedEventCategories(ctx: StateContext<ComparingeventsStateModel>) {
        try {
            const managedEventCategories = await this.appApiService.getManagedEventCategories();

            if (managedEventCategories && managedEventCategories.length > 0) {
                return ctx.patchState({
                    managedEventCategories,
                });
            }
            return;
        } catch(error) {
            return this.store.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(GetRole)
    async getRole(ctx: StateContext<ComparingeventsStateModel>) {
        try {
        const response: Observable<IGetUserRoleResponse> =
            await this.appApiService.getRole();

        return response.subscribe((res: IGetUserRoleResponse) => {
            const role = res.userRole ? res.userRole : 'Viewer';
            return ctx.dispatch(new SetRole(role));
        });
        } catch (error) {
        return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(SetRole)
    setRole(ctx: StateContext<ComparingeventsStateModel>, { newRole }: SetRole) {
        try {
        const state = ctx.getState();

        const newState = {
            ...state,
            role: newRole ? newRole : 'Viewer',
        };

        return ctx.dispatch(new SetCompareEventsState(newState));
        } catch (error) {
        return ctx.dispatch(new SetError((error as Error).message));
        }
    }
}