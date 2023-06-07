import { ICreateViewerRequest } from '../requests';

export class CreateViewerCommand {
  constructor(public readonly request: ICreateViewerRequest) { }
}
