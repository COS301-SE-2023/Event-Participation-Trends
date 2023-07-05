import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
const randomBytesP = promisify(randomBytes);

@Injectable()
export class SensorlinkingService {
  private eventSensorIdToMacAddressMap: Map<string, string>;
  constructor() {
    this.eventSensorIdToMacAddressMap = new Map<string, string>();
  }
  async linkSensorToEventSensor(mac: string, eventSensorId: string) {
    console.log(this.save());
    this.eventSensorIdToMacAddressMap.set(eventSensorId, mac);
  }
  async getNewEventSensorId(): Promise<string> {
    // Generate a random 4 character ascii string
    let randomValue = '';
    while(randomValue == '' || this.eventSensorIdToMacAddressMap.has(randomValue)){
      randomValue = (await randomBytesP(2)).toString('hex');
    }
    return randomValue;
  }
  async save(): Promise<Array<any>> {
    const out = new Array<any>();
    this.eventSensorIdToMacAddressMap.forEach((value, key) => {
      out.push({ eventSensorId: key, mac: value });
    });
    return out;
  }
  async load(data: Array<any>) {
    data.forEach((value) => {
      this.eventSensorIdToMacAddressMap.set(value.eventSensorId, value.mac);
    });
  }
  async isLinked(eventSensorId: string): Promise<boolean> {
    return this.eventSensorIdToMacAddressMap.has(eventSensorId);
  }
  async getMacAddress(eventSensorId: string): Promise<string> {
    return this.eventSensorIdToMacAddressMap.get(eventSensorId) || "";
  }
}
