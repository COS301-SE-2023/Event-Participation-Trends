import { Injectable } from '@nestjs/common';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { IMqttDataInterface, IMqttDeviceInterface } from '@event-participation-trends/api/event/util';
import { Types } from 'mongoose';
import { IMacToId } from '@event-participation-trends/api/event/data-access';

//REPLACE: replace with the event Id of the associated event 
const EVENT_ID = "64a1f7410891dcad57f0ed88";
@Injectable()
export class MqttService {
    
    static DEVICE_ID;
    static MAC_TO_DEVICE_ID;
    static SENSORS;

    constructor(private readonly eventRepository: EventRepository) {
        MqttService.DEVICE_ID =0;
        MqttService.MAC_TO_DEVICE_ID= new Map<string, number>();
        
        this.eventRepository.getBTIDtoDeviceBuffer(<Types.ObjectId> <unknown> EVENT_ID)
        .then((data)=>{
            data[0]["BTIDtoDeviceBuffer"].forEach(element=>{
                MqttService.MAC_TO_DEVICE_ID.set(element['mac'],element['id']);
            })
            
        })

        //REPLACE: pull this from database
        MqttService.SENSORS = new Array<string>('dc:54:75:9e:5d:1c');
    }

    async assignDeviceId(DeviceId :string) {
        MqttService.MAC_TO_DEVICE_ID.set(DeviceId,MqttService.DEVICE_ID++);
        // eslint-disable-next-line prefer-const
        let data:IMacToId ={
            mac: DeviceId,
            id: (MqttService.DEVICE_ID-1),
        }
        this.eventRepository.insertBTIDtoDeviceBuffer(<Types.ObjectId> <unknown> EVENT_ID,data);
        return (MqttService.DEVICE_ID-1);
    }

    async processData(data: any) {

        const Obj = data;
        
        //eslint-disable-next-line prefer-const
        let ConvertedObj: IMqttDataInterface ={
            sensorMac: Obj['sensorMac'],
            devices: [],
            origin: Obj['origin'],
            time: Obj['time']
        };
        
     
        //anonymize data
        await Obj.devices.forEach(async element => {
            if(!MqttService.SENSORS.includes(element['mac'])){
                let temp2;
                if(!MqttService.MAC_TO_DEVICE_ID.has(element['mac'])){
                    temp2= await this.assignDeviceId(element['mac']);
                }else{
                    temp2 = MqttService.MAC_TO_DEVICE_ID.get(element['mac']);
                }
                // eslint-disable-next-line prefer-const
                let temp: IMqttDeviceInterface ={
                    mac: temp2,
                    rssi: element['rssi']
                }
                ConvertedObj.devices.push(temp);
            }
        });
        

        //save data into database 
        this.eventRepository.insertSensorData(<Types.ObjectId> <unknown> EVENT_ID, ConvertedObj);
    }


}
