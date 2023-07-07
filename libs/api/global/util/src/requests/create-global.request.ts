import { ISensorIdToMac} from "../interfaces";

export interface ICreateGlobalRequest{
    sensorIdToMacs: ISensorIdToMac[] | undefined | null;
}