import { EventService } from '@event-participation-trends/api/event/feature';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { Interval } from '@nestjs/schedule';
import { IEvent } from '@event-participation-trends/api/event/util';
import { GlobalService } from '@event-participation-trends/api/global/feature';
import { SensorIdToMac } from '@event-participation-trends/api/global/util';
const randomBytesP = promisify(randomBytes);

@Injectable()
export class SensorlinkingService {
  private eventSensorIdToMacAddressMap: Map<string, string>;
  public events: Array<IEvent>;
  public shouldUpdate: boolean;
  constructor(private readonly eventService: EventService, private readonly globalService: GlobalService) {
    this.eventSensorIdToMacAddressMap = new Map<string, string>();
    this.events = new Array<IEvent>();
    this.shouldUpdate = false;
  }
  async linkSensorToEventSensor(mac: string, eventSensorId: string) {
    await this.load();
    this.eventSensorIdToMacAddressMap.set(eventSensorId, mac);
    await this.save();
  }
  async getNewEventSensorId(): Promise<string> {
    // Generate a random 4 character ascii string
    let randomValue = '';
    while(randomValue == '' || this.eventSensorIdToMacAddressMap.has(randomValue)){
      randomValue = (await randomBytesP(2)).toString('hex');
    }
    return randomValue;
  }
  async save(): Promise<Array<SensorIdToMac>> {
    const out = new Array<any>();
    this.eventSensorIdToMacAddressMap.forEach((value, key) => {
      out.push({ eventSensorId: key, mac: value });
    });
    await this.globalService.createGlobal(
      {
        sensorIdToMacs: out
      }
    );
    return out;
  }
  async load() {
    (await this.globalService.getGlobal(
      {
        sensorIdToMacs: true
      }
    )).sensorIdToMacs?.forEach((value) => {
      this.eventSensorIdToMacAddressMap.set(value.eventSensorId || "", value.mac || "");
    });
  }
  async isLinked(eventSensorId: string): Promise<boolean> {
    return this.eventSensorIdToMacAddressMap.has(eventSensorId);
  }
  async getMacAddress(eventSensorId: string): Promise<string> {
    return this.eventSensorIdToMacAddressMap.get(eventSensorId) || "";
  }
  @Interval(10000)
  async refreshEvents() {
    if(!this.shouldUpdate)
      return;
    this.eventService.getAllEvent({
      AdminEmail: '',
    }).then((events) => {
      this.events = events.events;
    }
    );
    this.load();
  }
}
