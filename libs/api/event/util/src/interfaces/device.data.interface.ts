
export interface IMqttDeviceInterface{
    mac: string | undefined | null,
    rssi: number | undefined | null,
}

export class MqttDevice implements IMqttDeviceInterface{
    mac: string | undefined | null;
    rssi: number | undefined | null;
}
