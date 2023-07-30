import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetCanCreateFloorPlan, SetNewlyCreatedEvent } from "@event-participation-trends/app/addevent/util";
import { IEvent } from "@event-participation-trends/api/event/util";

export interface AddEventStateModel {
    canCreateFloorPlan: boolean;
    newlyCreatedEvent: IEvent | null;
}

@State<AddEventStateModel>({
    name: 'addevent',
    defaults: {
        canCreateFloorPlan: false,
        newlyCreatedEvent: null
    }
})

@Injectable()
export class AddEventState {
    @Selector()
    static getCanCreateFloorPlan(state: AddEventStateModel) {
        return state.canCreateFloorPlan;
    }

    @Selector()
    static getNewlyCreatedEvent(state: AddEventStateModel) {
        return state.newlyCreatedEvent;
    }

    @Action(SetCanCreateFloorPlan)
    setCanCreateFloorPlan(ctx: StateContext<AddEventStateModel>, { value }: SetCanCreateFloorPlan) {
        ctx.patchState({ canCreateFloorPlan: value});
    }

    @Action(SetNewlyCreatedEvent)
    setNewlyCreatedEvent(ctx: StateContext<AddEventStateModel>, { event }: SetNewlyCreatedEvent) {
        ctx.patchState({ newlyCreatedEvent: event});
    }
}
