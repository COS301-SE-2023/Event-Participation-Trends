import {IEventDetails} from '../interfaces';

export interface IUpdateEventDetailsRequest{
    eventId: string | undefined | null,
    eventDetails: IEventDetails,
}