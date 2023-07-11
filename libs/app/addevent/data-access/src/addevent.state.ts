import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetCanCreateFloorPlan } from "@event-participation-trends/app/addevent/util";

export interface AddEventStateModel {
    canCreateFloorPlan: boolean;
}

@State<AddEventStateModel>({
    name: 'addevent',
    defaults: {
        canCreateFloorPlan: false
    }
})

@Injectable()
export class AddEventState {
    @Selector()
    static getCanCreateFloorPlan(state: AddEventStateModel) {
        return state.canCreateFloorPlan;
    }

    @Action(SetCanCreateFloorPlan)
    setCanCreateFloorPlan(ctx: StateContext<AddEventStateModel>, { value }: SetCanCreateFloorPlan) {
        ctx.patchState({ canCreateFloorPlan: value});
    }
}
