import { ICreateWall} from '../interfaces';

export class CreateWallEvent {
  constructor(public readonly event: ICreateWall) {}
}