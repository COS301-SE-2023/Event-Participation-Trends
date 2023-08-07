import { ISensorIdToMac} from "../interfaces";

export interface IGetGlobalResponse{
    sensorIdToMacs: ISensorIdToMac[] | undefined | null;
}