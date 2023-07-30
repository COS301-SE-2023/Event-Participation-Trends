import { ISensorIdToMac} from "./SensorIdToMacs.interface";

export interface IGlobal{
    SensorIdToMacs: ISensorIdToMac[] | undefined | null;
}