import { IMqttDeviceInterface, MqttDevice } from "./device.data.interface";

export interface IMqttDataInterface{
    sensorMac: string | undefined | null,
    devices: IMqttDeviceInterface[] | undefined | null,
    origin: string | undefined | null,
    time: Date | undefined | null,
}

export class MqttData implements IMqttDataInterface{
    sensorMac: string | undefined | null;
    devices: MqttDevice[] | undefined | null;
    origin: string | undefined | null;
    time: Date | undefined | null;
}