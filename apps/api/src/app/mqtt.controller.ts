import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
    constructor(private readonly mqttservice : MqttService) {}
    @MessagePattern('/ble')
    async mqtt_ble(@Payload() data) {
        data.origin = 'ble';
        data.time = new Date();
        this.mqttservice.processData(data);
    };
    @MessagePattern('/wifi')
    async mqtt_wifi(@Payload() data) {
        data.origin = 'wifi';
        data.time = new Date();
        this.mqttservice.processData(data);
    }
}