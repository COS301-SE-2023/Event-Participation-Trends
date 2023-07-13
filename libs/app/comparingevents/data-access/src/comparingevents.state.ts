import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { GetAllCategories, SetCompareEventsState, SetSelectedCategory, UpdateCategories } from '@event-participation-trends/app/comparingevents/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { SetError } from '@event-participation-trends/app/error/util';

// Once we know the interface for the Comparingevents page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComparingeventsStateModel {
    selectedCategory: string;
    categories: string[];
}

@State<ComparingeventsStateModel>({
    name: 'comparingevents',
    defaults: {
        selectedCategory: '',
        categories: [],
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
}