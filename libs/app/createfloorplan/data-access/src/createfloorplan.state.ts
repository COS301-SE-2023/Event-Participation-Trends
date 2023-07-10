import { Injectable } from '@angular/core';
import { Action, State } from '@ngxs/store';

// Once we know the interface for the create floor plan we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateFloorPlanStateModel {
    sensors: {
        attrs: {
            x: number,
            y: number,
            width: number,
            height: number,
            cursor: string,
            draggable: boolean,
            cornerRadius: number,
            padding: number,
            fill: string,
            opacity: number,
            name: string,
            customId: string
        },
        isLinked: boolean,
    }[]
}

@State<CreateFloorPlanStateModel>({
    name: 'createfloorplan'
})

@Injectable()
export class CreateFloorPlanState {}