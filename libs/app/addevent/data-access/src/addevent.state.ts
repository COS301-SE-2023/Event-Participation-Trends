import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetCanCreateFloorPlanState } from "@event-participation-trends/app/addevent/util";

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

    @Action(SetCanCreateFloorPlanState)
    setCanCreateFloorPlanState(ctx: StateContext<AddEventStateModel>, { value }: SetCanCreateFloorPlanState) {
        ctx.patchState({ canCreateFloorPlan: value});
    }
}
