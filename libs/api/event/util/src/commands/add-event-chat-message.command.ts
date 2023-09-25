import { IAddChatMessageRequest} from '../requests';

export class AddChatMessageCommand {
  constructor(public readonly request: IAddChatMessageRequest) {}
}