import { Injectable } from '@angular/core';
import { Action, Selector, State } from '@ngxs/store';
import { SetSubPageNav } from '@event-participation-trends/app/subpagenav/util';

// Once we know the interface for the usermanagement page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SubPageNavStateModel {
    currentPage: string,
    prevPage: string
}

@State<SubPageNavStateModel>({
    name: 'subpagenav',
    defaults: {
        currentPage: '',
        prevPage: ''
    }
})

@Injectable()
export class SubPageNavState {

    @Selector()
    static currentPage(state: SubPageNavStateModel) {
        return state.currentPage;
    }

    @Selector()
    static prevPage(state: SubPageNavStateModel) {
        return state.prevPage;
    }

    @Action(SetSubPageNav)
    setSubPageNav(ctx: any, action: SetSubPageNav) {
        ctx.patchState({
            currentPage: action.currentPage,
            prevPage: action.prevPage
        });
    }
}