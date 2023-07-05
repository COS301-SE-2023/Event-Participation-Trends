import { IUpdateFloorlayoutRequest} from '../requests';

export class UpdateFloorlayoutCommand {
  constructor(public readonly request: IUpdateFloorlayoutRequest) {}
}