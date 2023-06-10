import { IEventDetails } from '../interfaces';

export interface ICreateEventRequest{
	ManagerEmail: string | undefined | null,
	Event: IEventDetails | undefined | null,
}