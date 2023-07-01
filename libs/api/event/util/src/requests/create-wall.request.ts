import { IWall } from '../interfaces';

export interface ICreateWallRequest{
	eventId: string | undefined | null,
    Wall: IWall | undefined | null,
}