
import { IDeleteEventImageRequest} from '../requests';

export class DeleteEventImageCommand {
  constructor(public readonly request: IDeleteEventImageRequest) {}
}
