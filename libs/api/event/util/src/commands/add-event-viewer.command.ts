import { IAddViewerRequest} from '../requests';

export class AddViewerCommand {
  constructor(public readonly request: IAddViewerRequest) {}
}