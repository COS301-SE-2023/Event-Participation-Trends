import { ICreateGlobalRequest} from '../requests';

export class CreateGlobalCommand {
  constructor(public readonly request: ICreateGlobalRequest) {}
}