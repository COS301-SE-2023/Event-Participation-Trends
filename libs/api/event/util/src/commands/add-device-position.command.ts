import { IAddDevicePositionRequest} from '../requests';

export class AddDevicePositionCommand {
  constructor(public readonly request: IAddDevicePositionRequest) {}
}