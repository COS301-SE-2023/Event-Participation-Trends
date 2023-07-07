import { IGlobal} from '../interfaces';

export class CreateGlobalEvent {
  constructor(public readonly event: IGlobal) {}
}