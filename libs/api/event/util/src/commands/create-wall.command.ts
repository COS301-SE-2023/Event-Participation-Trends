import { ICreateWallRequest} from '../requests';

export class CreateWallCommand {
  constructor(public readonly request: ICreateWallRequest) {}
}
