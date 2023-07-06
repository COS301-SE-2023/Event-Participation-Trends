
export interface ISensorIdToMac{
    eventSensorId: string | undefined | null;
    mac: string | undefined | null;
};

export class SensorIdToMac implements ISensorIdToMac{
    eventSensorId: string | undefined | null;
    mac: string | undefined | null;
};