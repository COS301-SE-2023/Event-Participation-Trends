import { IUser } from '../interfaces';

export class CreateViewerEvent {
  constructor(public readonly user: IUser) {}
}
